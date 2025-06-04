﻿import { QueuedItem, TranslationBatchItem } from '../types/translation';
import { BATCH_SIZE_LIMIT, MAX_ITEMS_PER_BATCH } from '../constants/constants';
import throttle from 'lodash.throttle';
import { Deferred } from './deferred';
import { fetchTranslations } from '../api/translation';

class TranslationHandler {
    translationQueue: QueuedItem[] = [];

    cachedTranslations: Record<string, Record<string, Record<string, string>>> = {};

    #handleTranslation = async (batch: TranslationBatchItem[]) => {
        try {
            const result = await fetchTranslations(batch.map(({ deferred: d, ...item }) => item));

            result.forEach((item, index) => {
                const batchItem = batch[index];

                if (!batchItem) {
                    return;
                }

                const { from, to, text } = batchItem;

                batchItem.deferred.resolve(item);
                this.cachedTranslations[from] ??= {};
                this.cachedTranslations[from][to] ??= {};
                this.cachedTranslations[from][to][text] = item;
            });
        } catch (ex) {
            batch.forEach((item) => {
                item.deferred.reject(ex);
            });
        }
    };

    #processedTranslationQueue = async () => {
        let totalLength = 0;
        let batch: TranslationBatchItem[] = [];

        while (this.translationQueue.length) {
            const { text, deferred, to, from } = this.translationQueue.shift() as QueuedItem;
            totalLength += text.length;
            batch.push({
                text,
                to,
                from,
                id: batch.length,
                deferred,
            });

            if (totalLength > BATCH_SIZE_LIMIT || batch.length >= MAX_ITEMS_PER_BATCH) {
                // eslint-disable-next-line no-await-in-loop
                await this.#handleTranslation(batch);
                batch = [];
                totalLength = 0;
            }
        }

        if (batch.length > 0) {
            await this.#handleTranslation(batch);
        }
    };

    #throttledProcessTranslationQueue = throttle(this.#processedTranslationQueue, 200, {
        leading: false,
    });

    translateText = (original: string, from: string, to: string) => {
        const cachedTranslation = this.cachedTranslations[from]?.[to]?.[original];
        if (typeof cachedTranslation === 'string') {
            return Promise.resolve(cachedTranslation);
        }

        const existingItem = this.translationQueue.find(
            (item) => item.text === original && item.to === to && item.from === from,
        );
        if (existingItem) {
            return existingItem.deferred.promise;
        }
        const deferred = new Deferred<string>();
        this.translationQueue.push({ text: original, deferred, to, from });
        void this.#throttledProcessTranslationQueue();
        if (this.translationQueue.length >= MAX_ITEMS_PER_BATCH) {
            void this.#throttledProcessTranslationQueue.flush();
        }
        return deferred.promise;
    };
}

const translationHandler = new TranslationHandler();

export default translationHandler;

import { InvalidTagPos } from '../BBCodeParser';
import type { CombinedItem, MatchingTag, Param, param } from '../bbCodeUtils';
import { BbCodes, replaceAt } from '../bbCodeUtils';

export default class BBCodeToHTMLParser {
    readonly showBbTags: boolean;
    readonly bbTagStyles: string;
    readonly invalidTagPos: InvalidTagPos;
    private totalLengthDifference: number = 0;

    constructor(showBbTags: boolean, bbTagStyles: string, invalidTagPos: InvalidTagPos) {
        this.showBbTags = showBbTags;
        this.bbTagStyles = bbTagStyles;
        this.invalidTagPos = invalidTagPos;
    }

    bbCodeTextToHTML = (text: string): string => {
        this.totalLengthDifference = 0;
        const combinedList = this.getCombinedTagList(text);

        const validTags = this.matchTags(combinedList);

        let newText = text;
        combinedList.forEach((c, ci) => {
            const validEntry = validTags.find((vt) => vt.open === ci || vt.close === ci);
            if (validEntry) {
                newText = this.replaceBbItemWithHTML(newText, c);
            }
        });

        // ToDo show valid & invalid parameters in Tags
        return newText;
    };

    private getCombinedTagList = (text: string): CombinedItem[] => {
        let bbRegExString = '';
        BbCodes.forEach((c, i) => {
            bbRegExString += c.bb;
            if (i !== BbCodes.length - 1) {
                bbRegExString += '|';
            }
        });
        const parameterRegEx = '[\\w]*?=("[^"]*?"|\'[^\']*?\'|„[^„“]*?“)';
        const regExOpen = `\\[(${bbRegExString})( ${parameterRegEx})*\\]`;
        const regExClose = `\\[\/(${bbRegExString})\\]`;
        const listOpen = text.matchAll(new RegExp(regExOpen, 'gi'));
        const listClose = text.matchAll(new RegExp(regExClose, 'gi'));
        let combinedList = [
            ...[...listOpen].map((i) => {
                const value: string = i[0].toLowerCase();
                const valueBb: string | undefined = value
                    ?.substring(1, value?.length - 1)
                    .trim()
                    .split(' ')[0];
                const BbCodeEntry = BbCodes.find((b) => b.bb === valueBb);
                if (!BbCodeEntry || value === null) {
                    return null;
                }
                const tag = BbCodeEntry.tag || BbCodeEntry.bb;
                const params = value.matchAll(new RegExp(parameterRegEx, 'gi'));
                return {
                    value,
                    index: i.index as number,
                    open: true,
                    tag,
                    bb: BbCodeEntry.bb,
                    lengthDifferenceBBToTag: tag.length - BbCodeEntry.bb.length,
                    params: [...params].map((p) => {
                        const param = p[0]?.split('=');
                        if (!param) {
                            return null;
                        }
                        return {
                            together: p[0],
                            param: param[0],
                            value: param[1],
                        } as param;
                    }),
                };
            }),
            ...[...listClose].map((i) => {
                const value: string = i[0].toLowerCase();
                const valueBb: string | undefined = value
                    ?.substring(2, value?.length - 1)
                    .trim()
                    .split(' ')[0];
                const BbCodeEntry = BbCodes.find((b) => b.bb === valueBb);
                if (!BbCodeEntry || value === null) {
                    return null;
                }
                const tag = BbCodeEntry.tag || BbCodeEntry.bb;
                return {
                    value,
                    index: i.index as number,
                    open: false,
                    tag,
                    bb: BbCodeEntry.bb,
                    lengthDifferenceBBToTag: tag.length - BbCodeEntry.bb.length,
                };
            }),
        ];
        combinedList = combinedList.filter((c) => c !== null);
        combinedList.sort((c1, c2) => (c1?.index || 0) - (c2?.index || 0));
        return combinedList as CombinedItem[];
    };

    private matchTags = (combinedList: CombinedItem[]): MatchingTag[] => {
        const addOpenTags = () => {
            combinedList.forEach((c, ci) => {
                if (c.open) {
                    matchingTags.push({ tag: c.tag as string, open: ci, close: null });
                }
            });
        };
        const isSameUnfinishedTag = (
            possibleMatch: MatchingTag,
            combinedItem: CombinedItem
        ): boolean =>
            possibleMatch.tag === combinedItem.tag &&
            possibleMatch.close === null &&
            possibleMatch.open !== null;
        const isValidNesting = (possibleMatch: MatchingTag, combinedItem: CombinedItem) => {
            for (
                let nestingMatchIndex = 0;
                nestingMatchIndex < matchingTags.length;
                nestingMatchIndex++
            ) {
                const nestingMatch = matchingTags[nestingMatchIndex] as MatchingTag;
                if (nestingMatch.open !== null && nestingMatch.close !== null) {
                    const matchOpen = combinedList[possibleMatch.open as number];
                    const nestingMatchOpen = combinedList[nestingMatch.open];
                    const nestingMatchClose = combinedList[nestingMatch.close];
                    if (
                        nestingMatchOpen &&
                        matchOpen &&
                        nestingMatchClose &&
                        ((nestingMatchOpen.index < matchOpen.index &&
                            nestingMatchClose.index > matchOpen.index &&
                            nestingMatchClose.index < combinedItem.index) ||
                            (nestingMatchClose.index > combinedItem.index &&
                                nestingMatchOpen.index < combinedItem.index &&
                                nestingMatchOpen.index > matchOpen.index))
                    ) {
                        /* ToDo not perfect behavior with middle mode => evtl change ???
                         * input => T[h1]est T[b]e[/h1]xt [b]BO[h1]H1 [b]Test[/b] test[/h1]LT[/b][link]LINK[/link]
                         * output => T[h1]est T<b>e[/h1]xt [b]BO<h1>H1 <b>Test</b> test</h1>LT</b><a>LINK</a>
                         *  ==> First h1 & /h1 tag is invalid, for last /b could second invalid b be used => h1 would also be valid
                         */
                        return false;
                    }
                }
            }
            return true;
        };

        let invalidTags: MatchingTag[] = [];
        let matchingTags: MatchingTag[] = []; // open & closeIndex in object in CombinedList

        addOpenTags();
        if (this.invalidTagPos === InvalidTagPos.middleTag) {
            //  closed from last to first, open from first to last
            for (
                let combinedItemIndex = combinedList.length - 1;
                combinedItemIndex >= 0;
                combinedItemIndex--
            ) {
                const combinedItem = combinedList[combinedItemIndex] as CombinedItem;
                if (!combinedItem.open) {
                    // open from first to last
                    let matchingIndex: number | null = null;
                    for (
                        let possibleMatchIndex = 0;
                        possibleMatchIndex < matchingTags.length;
                        possibleMatchIndex++
                    ) {
                        const possibleMatch = matchingTags[possibleMatchIndex] as MatchingTag;
                        if (isSameUnfinishedTag(possibleMatch, combinedItem)) {
                            // look if invalid Nesting (open Tag between and close outside) => invalid html => don't match
                            if (isValidNesting(possibleMatch, combinedItem)) {
                                matchingIndex = possibleMatchIndex;
                                break;
                            }
                        }
                    }
                    if (matchingIndex !== null) {
                        (matchingTags[matchingIndex] as MatchingTag).close = combinedItemIndex;
                    } else {
                        invalidTags.push({
                            tag: combinedItem.tag as string,
                            open: null,
                            close: combinedItemIndex,
                        });
                    }
                }
            }
        } else if (this.invalidTagPos === InvalidTagPos.outer) {
            // closed from first to last, open from last to first
            for (
                let combinedItemIndex = 0;
                combinedItemIndex < combinedList.length;
                combinedItemIndex++
            ) {
                const combinedItem = combinedList[combinedItemIndex] as CombinedItem;
                if (!combinedItem.open) {
                    // open from last to first
                    let matchingIndex: number | null = null;
                    for (
                        let possibleMatchIndex = matchingTags.length - 1;
                        possibleMatchIndex >= 0;
                        possibleMatchIndex--
                    ) {
                        const possibleMatch = matchingTags[possibleMatchIndex] as MatchingTag;
                        if (isSameUnfinishedTag(possibleMatch, combinedItem)) {
                            // look if invalid Nesting (open Tag between and close outside) => invalid html => don't match
                            if (isValidNesting(possibleMatch, combinedItem)) {
                                matchingIndex = possibleMatchIndex;
                                break;
                            }
                        }
                    }
                    if (matchingIndex !== null) {
                        (matchingTags[matchingIndex] as MatchingTag).close = combinedItemIndex;
                    } else {
                        invalidTags.push({
                            tag: combinedItem.tag as string,
                            open: null,
                            close: combinedItemIndex,
                        });
                    }
                }
            }
        }

        invalidTags = [...invalidTags, ...matchingTags.filter((m) => m.close === null)];
        const validTags = matchingTags.filter((m) => m.open !== null && m.close !== null);

        return validTags;
    };

    private replaceBbItemWithHTML = (text: string, item: CombinedItem): string => {
        const tagStartIndex = item.index + this.totalLengthDifference;
        let paramLength = 0;
        let paramString = '';
        item.params?.forEach((p: Param) => {
            if (p) {
                paramLength += p.together.length + 1; // +1 => space which was cut away via .split(' ') in getCombinedTagList
                paramString += ` ${p.together}`; // space added here
            }
        });
        const tagEndIndex =
            tagStartIndex +
            paramLength +
            ((item.tag?.length as number) - 1 - (item.lengthDifferenceBBToTag as number)) +
            (item.open ? 2 : 3);
        // b => [b] oder [/b] => length 3 / 4 (+2 / +3)

        let replacementString = '';
        let originalTag = '';
        if (item.open) {
            const shownBbTag = `<span class="open" ${this.bbTagStyles}>[${item.bb}${paramString}]</span>`;
            const hideBbTag = `<span class="open"></span>`;
            replacementString = `${this.showBbTags ? shownBbTag : hideBbTag}<${
                item.tag
            }${paramString}>`;
            originalTag = `[${item.tag}${paramString}]`;
        } else {
            const shownBbTag = `<span class="close" ${this.bbTagStyles}>[/${item.bb}]</span>`;
            const hideBbTag = `<span class="close"></span>`;
            replacementString = `</${item.tag}>${this.showBbTags ? shownBbTag : hideBbTag}`;
            originalTag = `[/${item.tag}]`;
        }
        // length difference is set only for next tag, because start & endIndex already set above
        this.totalLengthDifference +=
            (item.lengthDifferenceBBToTag as number) +
            (replacementString.length - originalTag.length);

        return replaceAt(text, tagStartIndex, tagEndIndex, replacementString);
    };
}

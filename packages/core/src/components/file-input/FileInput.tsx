import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { filterDuplicateFile, filterDuplicateFileUrls, isValidFileType } from '../../utils/file';
import { StyledFileInput } from './FileInput.styles';
import { FileList, FileListItem, FileSelect } from '../../index';

export type FileInputProps = {
    /**
     * Already uploaded files to display.
     */
    files?: FileListItem[];
    /**
     * An array of icons that should be displayed inside the FileInput
     */
    fileSelectionIcons?: string[];
    /**
     * The text that should be displayed inside the FileInput.
     */
    fileSelectionPlaceholder?: string;
    /**
     * The filetypes that could be selected. Example for multiple types: 'image/*, video/*'.
     */
    fileTypes?: string;
    /**
     * The icon of the image selection.
     */
    imageSelectIcons?: string[];
    /**
     * If set, pictures can be select via Pixabay.
     */
    imageSelectPlaceholder?: string;
    /**
     * Whether the FileInput is disabled.
     */
    isDisabled?: boolean;
    /**
     * The maximum amount of Files that can be uploaded.
     */
    maxFiles?: number;
    /**
     * The maximum size of a file in MB.
     */
    maxFileSizeInMB?: number;
    /**
     * A function to be executed when files are added.
     */
    onAdd?: (files: File[] | string[]) => void;
    /**
     * Function to be executed when the maximum amount of Files are reached.
     */
    onMaxFilesReached?: () => void;
    /**
     * A function to be executed when a file is removed.
     */
    onRemove?: (file: File | FileListItem | string) => void;
};

export type FileInputRef = {
    clear: () => void;
};

const FileInput = forwardRef<FileInputRef, FileInputProps>(
    (
        {
            fileSelectionIcons = ['fa fa-upload'],
            imageSelectIcons = ['ts-image'],
            fileTypes,
            onMaxFilesReached,
            maxFiles,
            onRemove,
            files,
            isDisabled,
            maxFileSizeInMB,
            onAdd,
            fileSelectionPlaceholder = 'Dateien hochladen',
            imageSelectPlaceholder,
        },
        ref,
    ) => {
        const [internalFiles, setInternalFiles] = useState<File[]>([]);
        const [internalImages, setInternalImages] = useState<string[]>([]);

        const handleInputClear = () => {
            setInternalFiles([]);
            setInternalImages([]);
        };

        useImperativeHandle(
            ref,
            () => ({
                clear: handleInputClear,
            }),
            [],
        );

        const handleAddImages = useCallback(
            (images: string[]) => {
                const newImages: string[] = [];

                images.forEach((image) => {
                    if (!filterDuplicateFileUrls({ files: internalImages, newFile: image })) {
                        newImages.push(image);
                    }
                });

                let tmp = newImages;

                if (maxFiles) {
                    tmp = newImages.slice(
                        0,
                        maxFiles -
                            (internalFiles.length + internalImages.length + (files?.length ?? 0)),
                    );
                }

                if (tmp.length > 0 && typeof onAdd === 'function') {
                    onAdd(tmp);
                }

                setInternalImages((prevState) => [...prevState, ...tmp]);
            },
            [files?.length, internalFiles.length, internalImages, maxFiles, onAdd],
        );

        const handleAddFiles = useCallback(
            (newFiles: File[]) => {
                const newFileItems: File[] = [];

                newFiles.forEach((file) => {
                    if (fileTypes && !isValidFileType({ file, types: fileTypes })) {
                        return;
                    }

                    if (file && !filterDuplicateFile({ files: internalFiles, newFile: file })) {
                        newFileItems.push(file);
                    }
                });

                let tmp = newFileItems;

                if (maxFiles) {
                    tmp = newFileItems.slice(
                        0,
                        maxFiles - (internalFiles.length + (files?.length ?? 0)),
                    );
                }

                if (tmp.length > 0 && typeof onAdd === 'function') {
                    onAdd(tmp);
                }

                setInternalFiles((prevState) => [...prevState, ...tmp]);
            },
            [fileTypes, files?.length, internalFiles, maxFiles, onAdd],
        );

        const handleAdd = useCallback(
            (newFiles: File[] | string[]) => {
                if (Array.isArray(newFiles) && newFiles.length > 0) {
                    if (typeof newFiles[0] === 'string') {
                        handleAddImages(newFiles as string[]);
                    } else {
                        handleAddFiles(newFiles as File[]);
                    }
                }
            },
            [handleAddFiles, handleAddImages],
        );

        const handleDeleteFile = useCallback(
            (id: string) => {
                let fileToDelete: File | FileListItem | string | undefined;

                const filteredFiles = internalFiles.filter((file) => {
                    const { name } = file;

                    if (name === id) {
                        fileToDelete = file;
                    }

                    return name !== id;
                });

                setInternalFiles(filteredFiles);

                if (!fileToDelete) {
                    const filteredImages = internalImages.filter((image) => {
                        if (image === id) {
                            fileToDelete = image;
                        }

                        return image !== id;
                    });

                    setInternalImages(filteredImages);
                }

                if (!fileToDelete) {
                    files?.forEach((file) => {
                        if (file.id === id || file.name === id) {
                            fileToDelete = file;
                        }
                    });
                }

                if (!fileToDelete || typeof onRemove !== 'function') {
                    return;
                }

                onRemove(fileToDelete);
            },
            [files, internalFiles, internalImages, onRemove],
        );

        const internalIsDisabled = useMemo(() => {
            if (isDisabled) {
                return true;
            }

            if (maxFiles) {
                if (internalFiles.length + internalImages.length >= maxFiles) {
                    if (typeof onMaxFilesReached === 'function') {
                        onMaxFilesReached();
                    }

                    return true;
                }
            }

            return false;
        }, [internalFiles.length, internalImages.length, isDisabled, maxFiles, onMaxFilesReached]);

        const filesToDisplay: FileListItem[] = useMemo(() => {
            const items: FileListItem[] = internalFiles.map(({ type, name, size }) => ({
                id: name,
                name,
                size,
                mimeType: type,
            }));

            internalImages.forEach((image) => {
                items.push({
                    id: image,
                    name: image,
                    size: 0,
                    mimeType: 'image/png',
                });
            });

            files?.forEach((file) => {
                items.push(file);
            });

            return items;
        }, [files, internalFiles, internalImages]);

        return useMemo(
            () => (
                <StyledFileInput>
                    <FileSelect
                        fileTypes={fileTypes}
                        fileSelectionIcons={fileSelectionIcons}
                        fileSelectionPlaceholder={fileSelectionPlaceholder}
                        imageSelectIcons={imageSelectIcons}
                        imageSelectPlaceholder={imageSelectPlaceholder}
                        maxFileSizeInMB={maxFileSizeInMB}
                        isDisabled={internalIsDisabled}
                        onAdd={handleAdd}
                    />
                    <FileList files={filesToDisplay} onRemove={handleDeleteFile} />
                </StyledFileInput>
            ),
            [
                fileTypes,
                fileSelectionIcons,
                fileSelectionPlaceholder,
                imageSelectIcons,
                imageSelectPlaceholder,
                maxFileSizeInMB,
                internalIsDisabled,
                handleAdd,
                filesToDisplay,
                handleDeleteFile,
            ],
        );
    },
);

FileInput.displayName = 'FileInput';

export default FileInput;

'use client'


import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import styles from '../../../styles/modules/FileUploader.module.css';

// ---------- Types ----------
export type UploadStatus =
    | 'queued'
    | 'uploading'
    | 'done'
    | 'error'
    | 'canceled'
    | 'too-big';

export interface FileItem {
    id: string;
    file: File;
    name: string;
    size: number;
    progress: number; // 0..100
    status: UploadStatus;
    xhr: XMLHttpRequest | null;
    response: string | null;
    error: string | null;
    uploadedAt: string | null; // ISO time
}

export interface FileUploaderProps {
    uploadUrl: string; // required endpoint: accepts multipart/form-data
    headers?: Record<string, string>;
    fieldName?: string; // default: 'file'
    accept?: string; // default: '*/*'
    multiple?: boolean; // default: true
    maxSizeMB?: number; // default: 50
    autoUpload?: boolean; // default: true
    className?: string;
    onComplete?: (items: FileItem[]) => void;
    onError?: (items: FileItem[]) => void;
}

// ---------- Utils ----------
const formatBytes = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const uid = (): string => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ---------- Component ----------
const FileUploader: React.FC<FileUploaderProps> = ({
                                                       uploadUrl,
                                                       headers = {},
                                                       fieldName = 'file',
                                                       accept = '*/*',
                                                       multiple = true,
                                                       maxSizeMB = 50,
                                                       autoUpload = true,
                                                       className = '',
                                                       onComplete,
                                                       onError,
                                                   }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const maxSizeBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

    const [items, setItems] = useState<FileItem[]>([]);

    // Add new files & validate
    const enqueueFiles = useCallback(
        (fileList: FileList | null) => {
            if (!fileList) return;
            const incoming: FileItem[] = Array.from(fileList).map((f) => ({
                id: uid(),
                file: f,
                name: f.name,
                size: f.size,
                progress: 0,
                status: 'queued',
                xhr: null,
                response: null,
                error: null,
                uploadedAt: null,
            }));

            incoming.forEach((it) => {
                if (maxSizeBytes && it.size > maxSizeBytes) {
                    it.status = 'too-big';
                    it.error = `ზომა აღემატება ზღვარს (${formatBytes(maxSizeBytes)})`;
                }
            });

            setItems((prev) => [...incoming, ...prev]);

            if (autoUpload) {
                // start queued uploads async
                setTimeout(() => incoming.forEach((it) => it.status === 'queued' && startUpload(it.id)), 0);
            }
        },
        [autoUpload, maxSizeBytes]
    );

    const openPicker = () => fileInputRef.current?.click();

    const startUpload = useCallback(
        (id: string) => {
            setItems((prev) => {
                const next = [...prev];
                const target = next.find((i) => i.id === id);
                if (!target || !uploadUrl || target.status !== 'queued') return prev;

                const xhr = new XMLHttpRequest();
                target.xhr = xhr;
                target.status = 'uploading';
                target.progress = 0;

                xhr.upload.onprogress = (evt: ProgressEvent<EventTarget>) => {
                    if (evt.lengthComputable) {
                        const p = Math.round((evt.loaded / evt.total) * 100);
                        setItems((cur) => cur.map((x) => (x.id === id ? { ...x, progress: p } : x)));
                    }
                };

                xhr.onload = () => {
                    const ok = xhr.status >= 200 && xhr.status < 300;
                    setItems((cur) =>
                        cur.map((x) =>
                            x.id === id
                                ? {
                                    ...x,
                                    status: ok ? 'done' : 'error',
                                    response: ok ? (xhr.responseText ?? '') : null,
                                    error: ok ? null : `შეცდომა: ${xhr.status}`,
                                    progress: 100,
                                    uploadedAt: ok ? new Date().toISOString() : null,
                                }
                                : x
                        )
                    );
                };

                xhr.onerror = () => {
                    setItems((cur) => cur.map((x) => (x.id === id ? { ...x, status: 'error', error: 'ქსელის შეცდომა' } : x)));
                };

                xhr.onabort = () => {
                    setItems((cur) => cur.map((x) => (x.id === id ? { ...x, status: 'canceled' } : x)));
                };

                xhr.open('POST', uploadUrl);
                // optional headers (e.g., Authorization)
                Object.entries(headers || {}).forEach(([k, v]) => {
                    try {
                        xhr.setRequestHeader(k, v);
                    } catch {}
                });
                const form = new FormData();
                form.append(fieldName, target.file, target.name);
                xhr.send(form);

                return next;
            });
        },
        [headers, fieldName, uploadUrl]
    );

    const removeItem = useCallback((id: string) => {
        setItems((prev) => {
            const it = prev.find((x) => x.id === id);
            if (it?.xhr && it.status === 'uploading') it.xhr.abort();
            return prev.filter((x) => x.id !== id);
        });
    }, []);

    const allFinished = useMemo(() => {
        const active = items.filter((i) => i.status === 'uploading' || i.status === 'queued');
        return active.length === 0 && items.length > 0;
    }, [items]);

    useEffect(() => {
        if (!items.length || !allFinished) return;
        const anyError = items.some((i) => i.status === 'error' || i.status === 'too-big');
        if (anyError) onError?.(items);
        else onComplete?.(items);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allFinished]);

    const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer?.files?.length) enqueueFiles(e.dataTransfer.files);
    };
    const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className={`${styles.wrap} ${className || ''}`}>
            {/* Header */}
            {/*<div className={styles.header}>ატვირთეთ ფაილი/ფაილები</div>*/}

            {/* Dropzone */}
            <div
                className={styles.dropzone}
                onDrop={onDrop}
                onDragOver={onDragOver}

                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
                aria-label="ფაილების არჩევა ან გადათრევა"
            >
                <div className={styles.dropLeft}>
          <span className={styles.cloudIcon} aria-hidden>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19.35 10.04A7.49 7.49 0 0 0 5.5 8.11a5.5 5.5 0 1 0-1.55 10.77h14.9A4.15 4.15 0 0 0 19.35 10.04ZM12 12v6m0-6-3 3m3-3 3 3" stroke="#111" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
                    <span className={styles.dropText}>ფოტოს/ფაილის ჩატვირთვა</span>
                </div>

                <button type="button" className={styles.pickBtn + ' title_font'} onClick={() => fileInputRef.current?.click()}>არჩევა</button>
                <input
                    ref={fileInputRef}
                    type="file"
                    className={styles.hidden}
                    multiple={multiple}
                    accept={accept}
                    onChange={(e) => enqueueFiles(e.target.files)}
                />
            </div>

            {/* Info note */}
            <p className={styles.note}>
                თუ დაგვიანებული არ არის ფაილის ჩანიშვნა სიახლეში უბრალოდ შეხებით შეგიძლია გააკეთო ზემოთ მოცემულ იმიჯზე
            </p>

            {/* Files list */}
            <div className={styles.list}>
                {items.map((it) => (
                    <div key={it.id} className={styles.row}>
                        <div className={styles.fileIcon} aria-hidden>
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                <path d="M8 2h5l5 5v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#eef2f5" stroke="#9aa3af"/>
                            </svg>
                        </div>

                        <div className={styles.meta}>
                            <div className={styles.name} title={it.name}>{it.name}</div>
                            <div className={styles.sub}>
                                {it.status === 'done' && (
                                    <>ატვირთულია • {it.uploadedAt ? new Date(it.uploadedAt).toLocaleString('ka-GE') : ''} • {formatBytes(it.size)}</>
                                )}
                                {it.status === 'uploading' && (
                                    <>იტვირთება… {it.progress}% • {formatBytes(it.size)}</>
                                )}
                                {it.status === 'queued' && <>მზადაა ატვირთვისთვის • {formatBytes(it.size)}</>}
                                {it.status === 'error' && <span className={styles.err}>შეცდომა • {it.error || 'ვერ აიტვირთა'}</span>}
                                {it.status === 'too-big' && <span className={styles.err}>ფაილი ძალიან დიდია • {formatBytes(it.size)}</span>}
                                {it.status === 'canceled' && <span className={styles.muted}>გაუქმებულია</span>}
                            </div>

                            <div className={styles.progressWrap} aria-hidden={it.status !== 'uploading'}>
                                <div className={styles.progressBar} style={{ width: `${it.progress}%` }} />
                            </div>
                        </div>

                        <button
                            type="button"
                            className={styles.removeBtn}
                            aria-label={it.status === 'uploading' ? 'გაუქმება' : 'წაშლა'}
                            onClick={() => removeItem(it.id)}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M6 6l12 12M18 6L6 18"/>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {!autoUpload && items.some((i) => i.status === 'queued') && (
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.primary}
                        onClick={() => items.filter((i) => i.status === 'queued').forEach((i) => startUpload(i.id))}
                    >
                        ატვირთვა
                    </button>
                </div>
            )}

            <div className={styles.footerHint}>ფორმატი: {accept} • ზღვარი: {maxSizeMB}MB</div>
        </div>
    );
};

export default FileUploader;




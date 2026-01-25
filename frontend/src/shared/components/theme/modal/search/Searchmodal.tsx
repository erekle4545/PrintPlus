'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import LocalizedLink from '@/shared/components/LocalizedLink/LocalizedLink';
import { generateSlug } from "@/shared/utils/mix";
import SearchMOdalCloseIcon from '@/shared/assets/icons/search/search_modal_close.svg';
import styles from './SearchModal.module.css';
import {axiosInstance} from "@/shared/hooks/useHttp";

interface SearchResult {
    id: number;
    title: string;
    description?: string;
    type: 'product' | 'category' | 'page';
    slug?: string;
    category_id?: number;
    page_id?: number;
    image?: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {

    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Debounced search function
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            performSearch(searchQuery);
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const performSearch = async (query: string) => {
        setLoading(true);

        try {
            const response = await axiosInstance(`/search?query=${encodeURIComponent(query)}`);

            if (response.data.success) {
                setSearchResults(response.data.data);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Generate URL based on result type
    const getResultUrl = (result: SearchResult): string => {
        if (result.type === 'product') {
            // console.log(result)
            return generateSlug(`${result.slug}`, result.id, 'pr');

        } else if (result.type === 'category') {
            const identifyId = result.category_id || result.id;
            return generateSlug(`${result.slug}`, identifyId, 'c');
        } else if (result.type === 'page') {
            const identifyId = result.page_id || result.id;
            return generateSlug(`${result.slug}`, identifyId, 'p');
        }
        return '#';
    };

    const handleResultClick = () => {
        setSearchQuery('');
        setSearchResults([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.searchModalOverlay}>
            <div className={styles.searchModalContainer} ref={modalRef}>


                <div className={styles.searchModalHeader}>
                    {/* Close button in top right corner */}
                    <div
                        className={styles.searchCloseBtn}
                        onClick={onClose}
                        aria-label="Close search"
                    >
                        <SearchMOdalCloseIcon  />
                    </div>
                    <div className={styles.searchInputWrapper}>
                        <i className={`bi bi-search ${styles.searchIcon}`}></i>
                        <input
                            ref={inputRef}
                            type="text"
                            className={styles.searchInput}
                            placeholder={t('search.placeholder') || 'რას ეძებთ?'}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.searchModalBody}>
                    {loading ? (
                        <div className={styles.searchLoading}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : searchQuery.trim().length < 2 ? (
                        <div className={styles.searchEmptyState}>
                            <i className={`bi bi-search ${styles.searchEmptyIcon}`}></i>
                            <p className="text-muted">{t('search.start.typing') || 'დაიწყეთ ძებნა...'}</p>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className={styles.searchNoResults}>
                            <i className={`bi bi-exclamation-circle ${styles.noResultsIcon}`}></i>
                            <p className="text-muted">{t('search.no.results') || 'ვერაფერი მოიძებნა'}</p>
                        </div>
                    ) : (
                        <div className={styles.searchResultsList}>
                            {searchResults.map((result) => (
                                <LocalizedLink
                                    key={result.id}
                                    href={getResultUrl(result)}
                                    className={styles.searchResultItem}
                                    onClick={handleResultClick}
                                >
                                    {result.image && (
                                        <div className={styles.searchResultImage}>
                                            <img src={result.image} alt={result.title} />
                                        </div>
                                    )}
                                    <div className={styles.searchResultContent}>
                                        <h6 className={styles.searchResultTitle}>{result.title}</h6>
                                        {result.description && (
                                            <p className={styles.searchResultDescription}>{result.description
                                                ?.replace(/<[^>]*>?/gm, '')
                                                ?.slice(0, 160)}</p>
                                        )}
                                        <span className={`${styles.searchResultType} badge bg-secondary`}>
                                            {result.type === 'product' && (t('product') || 'პროდუქტი')}
                                            {result.type === 'category' && (t('category') || 'კატეგორია')}
                                            {result.type === 'page' && (t('page') || 'გვერდი')}
                                        </span>
                                    </div>
                                    <i className={`bi bi-chevron-right ${styles.searchResultArrow}`}></i>
                                </LocalizedLink>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
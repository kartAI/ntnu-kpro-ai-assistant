import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import shortcuts from '../app/data/shortcuts';

type TBreadCrumbProps = {
    homeElement: React.ReactNode,
    separator: React.ReactNode,
    listClasses?: string,
    activeClasses?: string,
    capitalizeLinks?: boolean,
}

const NextBreadcrumb = ({ homeElement, separator, listClasses, activeClasses }: TBreadCrumbProps) => {
    const pathname = usePathname();
    const [history, setHistory] = useState<{ url: string; alias: string }[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHistory(getLocalStorageHistory());
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && pathname) {
            if (isInternalShortcut(pathname)) {
                resetHistory(pathname);
            } else {
                updateHistory(pathname);
            }
        }
    }, [pathname]);

    const getLocalStorageHistory = (): { url: string; alias: string }[] => {
        if (typeof window !== 'undefined') {
            const storedHistory = localStorage.getItem('breadcrumbHistory');
            try {
                return storedHistory ? JSON.parse(storedHistory) as { url: string; alias: string }[] : [{ url: '/', alias: 'Home' }];
            } catch (error) {
                console.error('Failed to parse breadcrumb history from localStorage:', error);
            }
        }
        return [{ url: '/', alias: 'Home' }];
    };

    const setHistoryTo = (path: string) => {
        setHistory(prevHistory => {
            const pathIndex = prevHistory.findIndex(item => item.url === path);
            if (pathIndex !== -1) {
                const newHistory = prevHistory.slice(0, pathIndex + 1);
                localStorage.setItem('breadcrumbHistory', JSON.stringify(newHistory));
                return newHistory;
            }
            return prevHistory;
        });
    };

    const isInternalShortcut = (path: string): boolean => {
        return shortcuts
            .some(shortcut => shortcut.subgroups.some(subgroup => subgroup.links.some((link) => link.url === path)));
    };

    const computeAlias = (path: string) => {
        const shortcut = shortcuts.find(shortcut =>
            shortcut.subgroups.some(subgroup =>
                subgroup.links.some(link => link.url === path)
            )
        );
    
        if (shortcut) {
            const foundLink = shortcut.subgroups.flatMap(subgroup => subgroup.links)
                .find(link => link.url === path);
    
            if (foundLink) {
                return shortcut.header + " - " + foundLink.label
            }
        }


        return capitalize(path.split('/').pop() ?? path)
    };

    const resetHistory = (path: string) => {
        const newHistory = [{ url: '/', alias: 'Home' }, { url: path, alias: computeAlias(path) }];
        setHistory(newHistory);
        localStorage.setItem('breadcrumbHistory', JSON.stringify(newHistory));
    };

    const updateHistory = (path: string) => {
        const alias = computeAlias(path);

        if (alias === 'Loading...') {
            return
        }

        setHistory(prevHistory => {
            const pathIndex = prevHistory.findIndex(item => item.url === path);
            if (pathIndex === -1) {
                const newHistory = [...prevHistory, { url: path, alias }];
                localStorage.setItem('breadcrumbHistory', JSON.stringify(newHistory));
                return newHistory;
            } else {
                const newHistory = prevHistory.slice(0, pathIndex + 1);
                localStorage.setItem('breadcrumbHistory', JSON.stringify(newHistory));
                return newHistory;
            }
        });
    };

    const capitalize = (str: string): string => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleLinkClick = (path: string) => {
        setHistoryTo(path);
    };

    return (
        <div className='sticky top-[60px] pl-10 z-40'>
            {history.length > 1 && (
            <ul className='hidden text-secondary-black backdrop-blur-sm text-md md:flex md:py-2 md:px-2 relative'>
                <li className='hover:underline mx-2 font-light'>
                    <Link href={'/'} onClick={() => handleLinkClick('/')}>
                        {homeElement}
                    </Link>
                </li>
                {history.length > 0 && separator}
                {history.map((breadcrumb, index) => {
                    const { url, alias } = breadcrumb;
                    if (!url || index === 0) return null; // Ensure breadcrumb is valid
                    const itemClasses = pathname === url ? `${listClasses} ${activeClasses}` : listClasses;
                    const itemLink = alias;

                    return (
                        <React.Fragment key={index}>
                            <li className={itemClasses}>
                                <Link href={url} onClick={() => handleLinkClick(url)}>{itemLink}</Link>
                            </li>
                            {history.length !== index + 1 && separator}
                        </React.Fragment>
                    );
                })}
            </ul>
                
            )}
        </div>
    );
};

export default NextBreadcrumb;

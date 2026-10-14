import Logo from '@/components/logo';
import ThemeToggle from '@/components/theme-toggle';
import VocabularySearch from '@/components/vocabulary-search';
interface HeaderBarProps {
    leftContent?: React.ReactNode|string;
    rightContent?: React.ReactNode|string;
    children?: React.ReactNode;
    needLogo?:boolean
}
export default function HeaderBar({leftContent, rightContent,children,needLogo=false}: HeaderBarProps) {
    return (
        <header className="h-16 bg-surface border-b border-app-border z-50 flex justify-between items-center gap-4 px-8 shadow-[0_4px_12px_rgba(29,43,41,0.04)] font-manrope antialiased">
            <div className="flex items-center min-w-0 truncate text-accent-strong font-extrabold text-lg font-headline-lg">
                { !!needLogo && <Logo className="mr-[15px]"></Logo>}
                {typeof leftContent === 'string' ? leftContent : leftContent}
            </div>
            <VocabularySearch></VocabularySearch>
            {children}
            <div className="flex items-center gap-4 shrink-0">
                {typeof rightContent === 'string' ? rightContent : rightContent}
                <ThemeToggle></ThemeToggle>
                <img alt="User profile avatar" className="w-10 h-10 rounded-full border-2 border-app-border shadow-sm object-cover" data-alt="professional portrait of a young woman with a friendly smile, neutral office background, soft natural lighting" />
            </div>
        </header>
    );
};

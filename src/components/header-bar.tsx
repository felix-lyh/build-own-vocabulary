import Logo from '@/components/logo';
interface HeaderBarProps {
    leftContent?: React.ReactNode|string;
    rightContent?: React.ReactNode|string;
    children?: React.ReactNode;
    needLogo?:boolean
}
export default function HeaderBar({leftContent, rightContent,children,needLogo=false}: HeaderBarProps) {
    return (
        <header className="h-16 bg-[#F8F9FA] border-b border-[#E9ECEF] z-50 flex justify-between items-center px-4 sm:px-8 shadow-[0_4px_12px_rgba(29,43,41,0.04)] font-manrope antialiased">
            <div className="flex items-center min-w-0 text-[#2EB7A3] font-extrabold text-lg font-headline-lg">
                { !!needLogo && <Logo className="mr-[15px]"></Logo>}
                {typeof leftContent === 'string' ? <span className="truncate">{leftContent}</span> : leftContent}
            </div>
            {children}
            <div className="flex items-center gap-4 sm:gap-6">
                {typeof rightContent === 'string' ? rightContent : rightContent}
                <img alt="User profile avatar" className="hidden sm:inline-block w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" data-alt="professional portrait of a young woman with a friendly smile, neutral office background, soft natural lighting"  />
            </div>
        </header>
    );
};

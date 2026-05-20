import Logo from '@/components/logo';
interface HeaderBarProps {
    leftContent?: React.ReactNode|string;
    rightContent?: React.ReactNode|string;
    children?: React.ReactNode;
    needLogo?:boolean
}
export default function HeaderBar({leftContent, rightContent,children,needLogo=false}: HeaderBarProps) {
    return (
        <header className="h-16 bg-[#F8F9FA] border-b border-[#E9ECEF] z-50 flex justify-between items-center px-8 shadow-[0_4px_12px_rgba(29,43,41,0.04)] font-manrope antialiased">
            <div className="flex items-center text-[#2EB7A3] font-extrabold text-lg font-headline-lg">
                { !!needLogo && <Logo className="mr-[15px]"></Logo>}
                {typeof leftContent === 'string' ? leftContent : leftContent}
            </div>
            {children}
            <div className="flex items-center gap-6">
                {typeof rightContent === 'string' ? rightContent : rightContent}
                <img alt="User profile avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" data-alt="professional portrait of a young woman with a friendly smile, neutral office background, soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaN6G7h5j0axdmbCaxDMVELjldPYiAfe9U45GDo4KB93Oo2NgmAxbPKiAVfyi26CiQI7tv60IMY1abxlx1FtKkMElDRssWeaXDla3nqRVyRyfnk0QmoGukiPwvSeTEF7QJMCjAPbJcYliXebkcBhWG6S4bV9EOBuATQrRIoBo8Gx9TmjDluNyR5dCC9zTGdAaJF7rn8PG8yhsXQ49LCx0mgdzq71STPoyik5CQaUV_RbynCgH7PKRH5VGQR1MYKGA-L-ta56b-orQ" />
            </div>
        </header>
    );
};

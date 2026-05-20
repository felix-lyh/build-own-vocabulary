import { useRouter } from 'next/navigation'
export default function Logo({className}:{className?:string}) {
    const router = useRouter();
    return (
        <div onClick={() => router.push('/')} className={`text-[#2EB7A3] cursor-pointer font-extrabold text-lg font-headline-lg ${className}`}>
            LexisFlow
        </div>
    );
};

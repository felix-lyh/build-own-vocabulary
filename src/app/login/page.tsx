'use client';
import {
    Field,
    FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoginParamsType } from "@/type/user"
import { useRef, useState } from "react"
import { $t } from "@/utils/index"
export default function Page() {

    const [userInfo, setUserInfo] = useState<LoginParamsType>({
        email: '',
        pwt: ''
    })
    const firstInputRef = useRef<HTMLInputElement>(null)


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submit', userInfo)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const determineEmailInvalid = () => {
        return !userInfo.email || !emailRegex.test(userInfo.email);
    }
    return (
        <div >
            
            <form onSubmit={handleSubmit} className="mt-[50px] mx-auto max-w-sm ">
                <h1 className='text-2xl font-bold mt-4'>{$t('login.page.header_desc')}</h1>
                <Field data-invalid={determineEmailInvalid()} className='flex items-center mt-1.5'>
                    <p className="text-text text-1">{$t('login.email')}</p>
                    <Input ref={firstInputRef} name="email" value={userInfo.email} onChange={(e: any) =>
                        setUserInfo((prev) => ({
                            ...prev,
                            email: e.target.value,
                        }))
                    } className='flex-1 text-text text-2' placeholder={$t('login.email_ph')}></Input>
                    { !userInfo.email && <FieldLabel>{ $t('login.email_ph') }</FieldLabel>}
                    { !!userInfo.email && !emailRegex.test(userInfo.email) && <FieldLabel>{ $t('login.email_ph.invalid') }</FieldLabel>}
                </Field>
                <Field data-invalid={!userInfo.pwt} className='flex items-center mt-1.5'>
                    <p className="text-text text-1">{$t('login.password')}</p>
                    <Input ref={firstInputRef} name="pwt" value={userInfo.pwt} onChange={(e: any) =>
                        setUserInfo((prev) => ({
                            ...prev,
                            pwt: e.target.value,
                        }))
                    } className='flex-1 h-lg text-text text-2' placeholder={$t('login.password_ph')}></Input>
                    {!userInfo.pwt && <FieldLabel>{ $t('login.password_ph')}</FieldLabel>}
                </Field>
                <div className='flex justify-end mt-1.5'>
                    <Button className='ml-1.5' disabled={!userInfo.email || !userInfo.pwt} type='submit'>{$t('login_btn')}</Button>
                </div>
            </form>
        </div>
    );
}

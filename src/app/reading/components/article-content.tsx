import { AreticleType,UpsertAreticleType } from '@/type/article';
interface PropsType extends AreticleType {

}
export default function ArticleContent({articleName,content,update}:PropsType) {
    return (
        <div className='w-[85%] py-[15px] mx-auto max-h-[calc(100vh-100px)] overflow-auto'>
            <h2>{}</h2>
            <div >{content}</div>
        </div>
        
    );
};

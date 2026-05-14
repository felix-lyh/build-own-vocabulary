import { useState, useEffect } from 'react';
import MemoryCard from '@/app/vocabulary/components/memory-card';
import InitBlock from '@/components/init-block';
import { useVocabularyStore } from '@/store/vocabulary';
import { useParams } from 'next/navigation'
import { $t } from '@/utils/index'
export default function memoryMode() {
    const [isReady, setIsReady] = useState(false)
    const { vocabularyList, fetchVocabularyList } = useVocabularyStore()
    const [currentIndex, setCurrentIndex] = useState(0)
    const params = useParams()
    let bookId = params.bookId as string
    const nextVocabularyFun = () => {
        if (currentIndex >= vocabularyList.length - 1) return;
        setCurrentIndex((pre) => {
            return pre + 1
        })
    }
    const prevVocabularyFun = () => {
        if (currentIndex <= 0) return;
        setCurrentIndex((pre) => {
            return pre - 1
        })
    }

    useEffect(() => {
        const handleInit = () => {
            setIsReady(true)
        }
        window.addEventListener('click', handleInit)
        window.addEventListener('keydown', handleInit)
        fetchVocabularyList({bookId,refresh:false})
        return () => {
            window.removeEventListener('click', handleInit);
            window.removeEventListener('keydown', handleInit);
        }
    }, [])
    return (
        <div className='flex justify-center items-center h-[50vh]'>
            { !isReady && vocabularyList.length &&  <InitBlock />}
            {isReady && vocabularyList.length ?
                <MemoryCard
                    {...vocabularyList[currentIndex]}
                    notNext={currentIndex >= (vocabularyList.length - 1)}
                    notPrev={currentIndex === 0}
                    onNextFun={nextVocabularyFun}
                    onPrevFun={prevVocabularyFun}
                >
                </MemoryCard>
                :
                <div className='w-full mt-[30px] text-2xl text-center'>{ $t('vocabulary_empty') }</div>
            }
        </div>
    );
};

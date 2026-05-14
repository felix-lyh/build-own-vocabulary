import { create } from 'zustand'
import { getVocabularyList } from '@/request/vocabulary'
import type { VocabularyDataType } from '@/type/vocabulary'

interface VocabularyStore {
    vocabularyList: VocabularyDataType[]
    loading: boolean
    error: string | null
    updateVocabularyList: (singleVocaObj: VocabularyDataType) => void
    fetchVocabularyList: (params:{bookId:string;page?:number;limit?:number;refresh:boolean}) => Promise<void>
}

export const useVocabularyStore = create<VocabularyStore>((set,get) => ({
    vocabularyList: [],
    loading: false,
    error: null,
    updateVocabularyList:(singleVocaObj: VocabularyDataType)=>{
        const { vocabularyList } = get()
        const updatedList = [singleVocaObj,...vocabularyList]
        set({ vocabularyList: updatedList })
    },
    fetchVocabularyList: async ({bookId,page = 1,limit = 0,refresh = false }) => {
        const { loading } = get()
        if(loading){
            return
        }
        const { vocabularyList } = get()
        if((!refresh && vocabularyList.length)){
            set({ vocabularyList: vocabularyList || [], loading: false })
            return
        }
        set({ loading: true, error: null })
        return new Promise(async (resolve,reject)=>{
            try {
                const res:any = await getVocabularyList({ bookId,page,limit })
                const data = res.payload
                set({ vocabularyList: data || [], loading: false })
                resolve(data)
            } catch (err: any) {
                set({ error: err, loading: false })
                reject({ error: err })
            }
        })
    },
}))

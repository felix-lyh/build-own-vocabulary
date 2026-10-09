export interface WorkType {
    workName: string;   // the title of the work
    workDesc: string;   // short description of the work
    workId: string;
    content: string;    // the writing content
    createTime: number; // Date.now
    update: number;
}

export type AddWorkType = Pick<WorkType, 'workName' | 'workDesc'>

export type UpdateWorkType = Partial<Pick<WorkType, 'workName' | 'workDesc' | 'content'>>

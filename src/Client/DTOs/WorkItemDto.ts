export interface WorkItemDto {
    id: number,
    fields: {
        "System.WorkItemType": string;
        "System.State": string,
        "System.Title": string,
        "Microsoft.VSTS.Common.Priority": number;
        "System.Parent": number | null;
    },
    relations: RelationDto[] | undefined;
};

export interface RelationDto {
    rel: string;
    url: string;
    attributes: {
        isLocked: boolean;
        name: string;
    }
}

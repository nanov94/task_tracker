import React from 'react';
import { organization, project} from '../../Configuration/Configuration';
import { getWorkTasks, getWorkItemsByID } from '../../Client/AzureDevOpsServiceClient';
import { WorkItemDto, RelationDto } from '../../Client/DTOs/WorkItemDto';
import { ITask, Task } from '../Task/Task';
import List from '@material-ui/core/List';

import styles from './TasksTreeStyles.module.scss';

export class TasksTree extends React.Component {
    state = {
        tasks: [],
    };

    getTreeWorkItem(workItems: WorkItemDto[]): ITask[] {
        const rootWorkItem = workItems.filter((item) => item.fields["System.Parent"] === undefined);
        const childWorkItem = workItems.filter((item) => item.fields["System.Parent"] !== undefined);

        const tree: ITask[] = rootWorkItem.map((rootItem) => {
            return this.getTreeChildWorkItem(rootItem, childWorkItem);
        });

        return tree;
    }

    getTreeChildWorkItem(parent: WorkItemDto, childArray: WorkItemDto[]): ITask {
        const hasChild = parent.relations !== undefined && parent.relations.some((item: RelationDto) => item.attributes.name === 'Child')
        let children: ITask[] = [];
        if (hasChild) {
            const filteredChildren = childArray.filter((item) => item.fields["System.Parent"] === parent.id);
            children = filteredChildren.map((child) => {
                return this.getTreeChildWorkItem(child, childArray);
            });
        }
        
        return {
            id: parent.id,
            priority: parent.fields["Microsoft.VSTS.Common.Priority"],
            type: parent.fields["System.WorkItemType"],
            state: parent.fields["System.State"],
            title: parent.fields["System.Title"],
            children
        }
    }

    componentDidMount() {
        getWorkTasks(organization, project)
        .then((res) => {
            const workItems = res.workItems;

            getWorkItemsByID(organization, project, workItems.map((item) => item.id))
            .then((res) => {
                const tree = this.getTreeWorkItem(res);
                this.setState({ tasks: tree });
            });
        });
    }

    render() {
        if (!this.state.tasks.length) {
            return <></>;
        }

        return (
            <>
                <h1>Tasks</h1>
                <List component="nav" aria-labelledby="nested-list-subheader" className={styles.tree}>
                    { this.state.tasks.map((task: ITask) => {
                            return (
                                <>
                                    <Task task={task} />
                                </>
                            );
                        })}
                </List>
            </>
        );
    }
}
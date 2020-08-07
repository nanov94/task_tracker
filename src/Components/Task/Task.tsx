import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import styles from './TaskStyles.module.scss';
import { removeWorkTaskByID } from '../../Client/AzureDevOpsServiceClient';
import { organization, project } from '../../Configuration/Configuration';

export interface ITask {
    id: number;
    priority: number;
    type: string;
    state: string;
    title: string;
    children?: ITask[];
}

export interface ITaskPropsComponent {
    task: ITask;
    onDeletedItem: (id: number) => void;
}

export class Task extends React.Component<ITaskPropsComponent> {
    state = {
        isOpen: false,
    };

    handleClick = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    handleRemoveItem = (id: number) => {
        removeWorkTaskByID(organization, project, id)
        .then((res) => {
            if (res) {
                this.props.onDeletedItem(id);
            }
        });
    }

    getSimpleListItem(label: string, id: number) {
        return (
            <ListItem button>
                <ListItemText primary={label} />
                <IconButton aria-label="delete" onClick={() => this.handleRemoveItem(id)}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        );
    }

    getExpandListItem(label: string, id: number, children: ITask[]) {
        return (
            <>
                <ListItem button onClick={this.handleClick}>
                    <ListItemText primary={label} />
                    <IconButton aria-label="delete" onClick={() => this.handleRemoveItem(id)}>
                        <DeleteIcon />
                    </IconButton>
                    {this.state.isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.isOpen} timeout="auto" unmountOnExit>
                    <div className={styles.nestedItem}>
                        <List component="div" disablePadding >
                            { children && children.map((child: ITask) => <Task task={child} onDeletedItem={this.props.onDeletedItem} />) }
                        </List>
                    </div>
                </Collapse>
            </>
        );
    }
    
    render() {
        const { task } = this.props;
        const label = `${task.id} - ${task.title}`;

        let taskElement = 
            task.children?.length
            ? this.getExpandListItem(label, task.id, task.children)
            : this.getSimpleListItem(label, task.id);

        return(
            <>
                { taskElement }
            </>
        );
    }
}
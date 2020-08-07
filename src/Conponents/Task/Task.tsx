import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';

import styles from './TaskStyles.module.scss';

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
}

export class Task extends React.Component<ITaskPropsComponent> {
    state = {
        isOpen: false,
    };

    handleClick = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    getSimpleListItem(label: string) {
        return (
            <ListItem button>
                <ListItemText primary={label} />
            </ListItem>
        );
    }

    getExpandListItem(label: string, children: ITask[]) {
        return (
            <>
                <ListItem button onClick={this.handleClick}>
                    <ListItemText primary={label} />
                    {this.state.isOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.isOpen} timeout="auto" unmountOnExit>
                    <div className={styles.nestedItem}>
                        <List component="div" disablePadding >
                            { children && children.map((child: ITask) => <Task task={child} />) }
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
            ? this.getExpandListItem(label, task.children)
            : this.getSimpleListItem(label);

        return(
            <>
                { taskElement }
            </>
        );
    }
}
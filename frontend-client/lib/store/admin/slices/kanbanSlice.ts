import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { UniqueIdentifier } from '@dnd-kit/core';

// Types
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Column {
    id: UniqueIdentifier;
    title: string;
}

export type Task = {
    id: string;
    title: string;
    description?: string;
    status: Status;
};

interface KanbanState {
    tasks: Task[];
    columns: Column[];
    draggedTask: string | null;
}

// Initial State
const defaultCols = [
    {
        id: 'TODO' as const,
        title: 'Todo'
    }
] satisfies Column[];

const initialTasks: Task[] = [
    {
        id: 'task1',
        status: 'TODO',
        title: 'Project initiation and planning'
    },
    {
        id: 'task2',
        status: 'TODO',
        title: 'Gather requirements from stakeholders'
    }
];

const initialState: KanbanState = {
    tasks: initialTasks,
    columns: defaultCols,
    draggedTask: null,
};

// Slice
const kanbanSlice = createSlice({
    name: 'kanban',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<{ title: string; description?: string }>) => {
            state.tasks.push({
                id: uuid(),
                title: action.payload.title,
                description: action.payload.description,
                status: 'TODO',
            });
        },
        addCol: (state, action: PayloadAction<string>) => {
            state.columns.push({
                title: action.payload,
                id: state.columns.length ? action.payload.toUpperCase() : 'TODO',
            });
        },
        dragTask: (state, action: PayloadAction<string | null>) => {
            state.draggedTask = action.payload;
        },
        removeTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        },
        removeCol: (state, action: PayloadAction<UniqueIdentifier>) => {
            state.columns = state.columns.filter((col) => col.id !== action.payload);
        },
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        },
        setCols: (state, action: PayloadAction<Column[]>) => {
            state.columns = action.payload;
        },
        updateCol: (state, action: PayloadAction<{ id: UniqueIdentifier; newName: string }>) => {
            const column = state.columns.find((col) => col.id === action.payload.id);
            if (column) {
                column.title = action.payload.newName;
            }
        },
    },
});

export const {
    addTask,
    addCol,
    dragTask,
    removeTask,
    removeCol,
    setTasks,
    setCols,
    updateCol,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;

import { useCallback, useReducer } from 'react';
import { readFileAsDataURL } from '../utils/readFileAsDataURL';

type LpFormOptions = {
  initialTitle?: string;
  initialContent?: string;
  initialThumbnail?: string | null;
  initialTags?: string[];
};

export type LpFieldErrors = {
  title?: string;
  content?: string;
};

type LpFormState = {
  title: string;
  content: string;
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
  tagInput: string;
  tags: string[];
  fieldErrors: LpFieldErrors;
  formError: string;
};

type LpFormAction =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_THUMBNAIL_FILE'; payload: File | null }
  | { type: 'SET_THUMBNAIL_PREVIEW'; payload: string | null }
  | { type: 'SET_TAG_INPUT'; payload: string }
  | { type: 'ADD_TAG'; payload: string }
  | { type: 'REMOVE_TAG'; payload: string }
  | { type: 'SET_FIELD_ERRORS'; payload: LpFieldErrors }
  | { type: 'SET_FORM_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' };

function createInitialState({
  initialTitle = '',
  initialContent = '',
  initialThumbnail = null,
  initialTags = [],
}: LpFormOptions): LpFormState {
  return {
    title: initialTitle,
    content: initialContent,
    thumbnailFile: null,
    thumbnailPreview: initialThumbnail,
    tagInput: '',
    tags: initialTags,
    fieldErrors: {},
    formError: '',
  };
}

function lpFormReducer(state: LpFormState, action: LpFormAction): LpFormState {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload, fieldErrors: { ...state.fieldErrors, title: undefined } };
    case 'SET_CONTENT':
      return { ...state, content: action.payload, fieldErrors: { ...state.fieldErrors, content: undefined } };
    case 'SET_THUMBNAIL_FILE':
      return { ...state, thumbnailFile: action.payload };
    case 'SET_THUMBNAIL_PREVIEW':
      return { ...state, thumbnailPreview: action.payload };
    case 'SET_TAG_INPUT':
      return { ...state, tagInput: action.payload };
    case 'ADD_TAG':
      return {
        ...state,
        tags: state.tags.includes(action.payload) ? state.tags : [...state.tags, action.payload],
        tagInput: '',
      };
    case 'REMOVE_TAG':
      return { ...state, tags: state.tags.filter((tag) => tag !== action.payload) };
    case 'SET_FIELD_ERRORS':
      return { ...state, fieldErrors: action.payload, formError: '' };
    case 'SET_FORM_ERROR':
      return { ...state, formError: action.payload };
    case 'CLEAR_ERRORS':
      return { ...state, fieldErrors: {}, formError: '' };
    default:
      return state;
  }
}

export function useLpForm(options: LpFormOptions = {}) {
  const [state, dispatch] = useReducer(lpFormReducer, options, createInitialState);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch({ type: 'SET_THUMBNAIL_FILE', payload: file });
    try {
      const preview = await readFileAsDataURL(file);
      dispatch({ type: 'SET_THUMBNAIL_PREVIEW', payload: preview });
    } catch {
      dispatch({ type: 'SET_THUMBNAIL_FILE', payload: null });
      dispatch({ type: 'SET_THUMBNAIL_PREVIEW', payload: null });
    }
  }, []);

  const handleRemoveThumbnail = useCallback(() => {
    dispatch({ type: 'SET_THUMBNAIL_FILE', payload: null });
    dispatch({ type: 'SET_THUMBNAIL_PREVIEW', payload: null });
  }, []);

  const handleAddTag = useCallback(() => {
    const trimmed = state.tagInput.trim();
    if (!trimmed || state.tags.includes(trimmed)) {
      dispatch({ type: 'SET_TAG_INPUT', payload: '' });
      return;
    }
    dispatch({ type: 'ADD_TAG', payload: trimmed });
  }, [state.tagInput, state.tags]);

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag],
  );

  const handleRemoveTag = useCallback((tag: string) => {
    dispatch({ type: 'REMOVE_TAG', payload: tag });
  }, []);

  const validate = useCallback((): boolean => {
    const fieldErrors: LpFieldErrors = {};
    if (!state.title.trim()) fieldErrors.title = '제목을 입력해주세요.';
    if (!state.content.trim()) fieldErrors.content = '내용을 입력해주세요.';
    dispatch({ type: 'SET_FIELD_ERRORS', payload: fieldErrors });
    return Object.keys(fieldErrors).length === 0;
  }, [state.title, state.content]);

  const setError = useCallback((message: string) => {
    dispatch({ type: 'SET_FORM_ERROR', payload: message });
  }, []);

  return {
    title: state.title,
    setTitle: (value: string) => dispatch({ type: 'SET_TITLE', payload: value }),
    content: state.content,
    setContent: (value: string) => dispatch({ type: 'SET_CONTENT', payload: value }),
    thumbnailFile: state.thumbnailFile,
    thumbnailPreview: state.thumbnailPreview,
    tagInput: state.tagInput,
    setTagInput: (value: string) => dispatch({ type: 'SET_TAG_INPUT', payload: value }),
    tags: state.tags,
    fieldErrors: state.fieldErrors,
    error: state.formError,
    setError,
    handleFileChange,
    handleRemoveThumbnail,
    handleAddTag,
    handleTagKeyDown,
    handleRemoveTag,
    validate,
  };
}

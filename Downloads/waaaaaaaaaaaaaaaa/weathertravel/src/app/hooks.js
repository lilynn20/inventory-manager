/**
 * Custom Redux hooks for the application
 * 
 * These hooks provide a typed and safer way to use Redux in the app.
 * Following Redux Toolkit best practices.
 */

import { useDispatch, useSelector } from 'react-redux';

/**
 * Hook for dispatching Redux actions
 * @returns {Function} Redux dispatch function
 */
export const useAppDispatch = () => useDispatch();

/**
 * Hook for selecting Redux state
 * @param {Function} selector - Redux selector function
 * @returns {*} Selected state slice
 */
export const useAppSelector = useSelector;

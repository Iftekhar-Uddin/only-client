import {createContext, useReducer} from 'react';
import { Initial_Value, postReducer} from './PostReducer';

  
export const PostContext = createContext([]);
export const PostContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(postReducer, Initial_Value);
    
    return (
      <PostContext.Provider
        value={{
          posts: state.posts,
          dispatch,
        }}
        >
        {children}
      </PostContext.Provider>
    );
};

export default PostContextProvider;

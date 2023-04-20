import {createContext} from 'react';

const AvatarContext = createContext({
    refetchAvatar: false,
    triggerRefetchAvatar: () => {
    },
});

export default AvatarContext;
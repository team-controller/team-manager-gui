import React, { useState } from 'react'

const Context = React.createContext({})

export function UserContextProvider ({children}) {
    const [auth, setAuth] = useState(() => JSON.parse(window.sessionStorage.getItem('user')))
    const [currentTeam, setCurrentTeam] = useState(undefined);
    
    return <Context.Provider value={{auth, setAuth, currentTeam, setCurrentTeam}}>
        {children}
    </Context.Provider>
}

export default Context
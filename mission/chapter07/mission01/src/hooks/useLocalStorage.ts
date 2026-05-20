//src/hooks/useLovalStorage.ts

//key값은 AccessToken, RefreshToken, localStorage에서 값을 받고 던지기 등등 가능
export const useLocalStorage = (key:string)=>{
    const setItem = (value: unknown) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    };

    const getItem = () => {
        try{
            const item = window.localStorage.getItem(key);
            if (!item || item === 'undefined') return null;
            return  JSON.parse(item);
        } catch(e){
            console.log(e);
            return null;
        }
    };

    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch(error) {
            console.log(error);
        }
    };

    return {setItem, getItem, removeItem}
};
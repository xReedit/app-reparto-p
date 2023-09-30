//verify login status
export const setValueToken = (value: any): void => {    
    localStorage.setItem('token', value);
}

export const getValueToken = (key: string): any => {
    // if (localStorage.getItem('token')) {
    const token = localStorage.getItem('token')?.split('.')[1] || '';
    const _data = JSON.parse(atob(token))
    if (_data[key]) {
        return _data[key]
    } else {
        console.log(`token key ${key} not exist`, _data);
        return false
    }
}
import { IMagazin } from "../store/type";

export const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const createMagazin_Schema = (): IMagazin => {
    return {
        id: '',
        title: '',
        genres: [],
        language: [],
        posterImageUrl: '',
        singer: { name: '', imagePath: '' },
        streamUrl: ''
    }
}
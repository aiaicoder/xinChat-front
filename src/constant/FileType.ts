// @ts-ignore

const FileType = {
    jepg: 0, jpg: 0, png: 0, gif: 0, bmp: 0, webp: 0, svg: 0,
    mp4: 1, avi: 1, mkv: 1, mov: 1, wmv: 1, rmvb: 1, flv: 1,
    0: "图片",
    1: "视频",
    2: "文件"
}


const getFileType = (suffix:any) => {
    if (suffix == undefined) {
        return 2;
    }
    if (typeof suffix == 'string'){
        suffix = suffix.toLowerCase();
    }

    // @ts-ignore
    const fileType: number = FileType[suffix];
    return fileType == undefined ? 2 : fileType;
}

export {
    getFileType
}
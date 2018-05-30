function unique(arr, comparator) {
    const res = new Array()
    if (arr == null || arr.length <= 1) {
        return arr
    }
    for (let i = 0; i < arr.length; i++) {
        const a = arr[i];
        var contains = false
        for (let j = i + 1; j < arr.length; j++) {
            const e = arr[j];
            contains = comparator(a, e)
            if (contains == true) {
                break
            }
        }
        if (!contains) {
            res.push(a)
        }
    }
    return res
}



export {
    unique
}
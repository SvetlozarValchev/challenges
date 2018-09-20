export function groupBy(list, key) {
    return list.reduce(function (rv, x) {
        const t = (rv[x[key]] = rv[x[key]] || []);

        delete x[key];
        t.push(x);

        return rv;
    }, {});
}
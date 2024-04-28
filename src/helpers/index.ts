export default function nestedJsonParseToDate(
    jsonObj: any,
    keys: string[]
): any {
    function traverse(obj: any) {
        if (typeof obj === "object") {
            if (Array.isArray(obj)) {
                obj.forEach((item) => traverse(item));
            } else {
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (keys.includes(key)) {
                            if (
                                typeof obj[key] === "string" &&
                                obj[key].match(
                                    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
                                )
                            ) {
                                obj[key] = new Date(obj[key]);
                            }
                        }
                        traverse(obj[key]);
                    }
                }
            }
        }
    }

    traverse(jsonObj);

    return jsonObj;
}

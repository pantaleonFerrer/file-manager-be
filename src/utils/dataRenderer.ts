const { toCamelCase } = require('js-convert-case');


/*
    Está función sirve para renderizar los datos. Los datos que puede recibir son un array o un objeto. Dependiendo del tipo
    de dato inicial que reciba hará una acción u otra para poder tratarlo. Una vez está tratando el tipo de dato principal
    hara lo siguiente:
    
    1 - Convertir los parametros de cada objeto en cammelCase 
    2 - Eliminar el ID y el deleted_at + datos sensibles
    3 - hacer parseJSON a todos los campos que se requiera (Empiezan por { o por [ )
    4 - Convierte a fecha todos los campos que acaben en At o contengan "date"
    5 - Convierte en Boolean todos los campos que empiezen por is
    
    Estas normas generales deben ser aplicadas en DB.

    En caso de haber relaciones en los datos recibidos se ejecutará también sobre las relaciones

*/
export const dataRenderer = (data: any, ignoreCases: boolean = false): any[] => {

    const resultToSend = []

    if (Array.isArray(data)) {

        for (let row of data) {

            const toPush = renderObject(row, ignoreCases);

            resultToSend.push(toPush);
        }
    } else {

        data = renderObject(data, ignoreCases);

        resultToSend.push(data);
    }

    return resultToSend;
}

export function parseJSONFromLongText(value: string | { [x: string]: any }) {
    if (value === "[]") {
        return null;
    } else if (typeof (value) === "string") {
        try {
            return JSON.parse(value);
        } catch (err) {
            return value;
        }
    } else {
        return value;
    }
}

/*
    Está función sirve para renderizar los datos. Los datos que puede recibir son un array o un objeto. Dependiendo del tipo
    de dato inicial que reciba hará una acción u otra para poder tratarlo. Una vez está tratando el tipo de dato principal
    hara lo siguiente:
    
    1 - Convertir los parametros de cada objeto en cammelCase 
    2 - Eliminar el ID y el deleted_at + datos sensibles
    3 - hacer parseJSON a todos los campos que se requiera (Empiezan por { o por [ )
    4 - Convierte a fecha todos los campos que acaben en At o contengan "date"
    5 - Convierte en Boolean todos los campos que empiezen por is
    
    Estas normas generales deben ser aplicadas en DB.

    En caso de haber relaciones en los datos recibidos se ejecutará también sobre las relaciones

*/

function renderObject(data: any, ignoreCases: boolean = false) {

    for (let values in data) {

        // Renderizar relaciones de 1 solo

        if (typeof data[values] === "object" && data[values] != null && data[values].key != null && data[values].rendered == null) {
            const dataSub: any = dataRenderer(data[values], ignoreCases);
            dataSub.rendered = true;
            data[values] = dataSub;
            continue;
        }

        // Renderizar relaciones de many

        if (Array.isArray(data[values]) && data[values][0] != null && data[values][0].rendered == null) {

            const arrayToPush: any[] = [];

            for (let included of data[values]) {
                const dataSub: any = dataRenderer(included, ignoreCases);
                dataSub.rendered = true;
                arrayToPush.push(dataSub);
            }


            data[values] = arrayToPush;
            continue;
        }

        if (values !== "key") {
            const newValues = toCamelCase(values);
            data[newValues] = data[values];
            if (newValues !== values)
                delete data[values];
            values = newValues;
        }

        // Elimino información importante generica
        if (!ignoreCases && (values.toLowerCase().includes("id") || values === "deletedAt" || values === "password" || values === "signupWith")) {
            delete data[values];
        }
        if (typeof data[values] === "string" && data[values].indexOf("{") === 0) {
            data[values] = parseJSONFromLongText(data[values])
        }
        if (typeof data[values] === "string" && data[values].indexOf("[") === 0) {
            data[values] = parseJSONFromLongText(data[values])
        }
        if ((values.endsWith("At") || values.indexOf("date") === 0) && data[values] != null) {
            try {
                data[values] = data[values]?.getTime();
            } catch { }
        }

        if (values.indexOf("is") === 0) {
            data[values] = !!data[values];
        }
    }

    return data;
}
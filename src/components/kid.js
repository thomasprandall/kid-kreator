import { Disclosure } from '@headlessui/react'

export function Kid(name, type) {
    return (
        <Disclosure as={'kid' + name} className="bg-yellow">
            <h1>
                {name}, {type}
            </h1>
        </Disclosure>
    )
}

export function AttributeRows(id, attributes) {
    return (
        Object.keys(attributes).map(function (key) {
            return (
            <tr>
                <th className='capitalize'>{key}</th>
                <td>
                    <input
                        type="number"
                        name={"body_" + id}
                        defaultValue={attributes[key]}
                        max="5"
                        min="1" />
                </td>
            </tr>
            )
        })
    )
};

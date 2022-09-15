import { Disclosure } from '@headlessui/react'

export const Kid = ({ kid, selected, changeKid, deleteKid, index }) => (
    <>
        <Disclosure className={(selected ? 'bg-orange' : '') + ' p-1 border-solid border-b-2'} onClick={() => changeKid(index)}>
            <h1>
                {kid.name}, {kid.type}
                <span className="float-right" onClick={() => deleteKid(index)}>X</span>
            </h1>
        </Disclosure>
    </>
);
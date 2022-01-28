import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

const ListeDeroulante = ({ preSelect, list, onChange, disabled }) => {
    const [selected, setSelected] = useState(preSelect ? preSelect: '');

    const handleChange = (value) => {        
        onChange(value);
        setSelected(value);
    };

    return (
        <div className={`w-52 lg:w-72 ${disabled ? 'opacity-75' : 'cursor-pointer'}`}>
        <Listbox disabled={disabled ? true : false} value={selected} onChange={handleChange}>
            <div className="relative">
            <Listbox.Button className={`${disabled ? '' : 'cursor-pointer'} relative text-white border-2  border-white w-full py-0.5 pl-3 pr-10 text-left rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm`}>
                <span className="block truncate">{selected || 'Choisir'}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                    className="w-4 h-4 text-gray-200"
                    aria-hidden="true"
                />
                </span>
            </Listbox.Button>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 sm:text-sm">
                {list.map((item, itemIdx) => (
                    <Listbox.Option
                    key={itemIdx}
                    className={({ active }) =>
                        `${active ? 'text-blue-900 bg-blue-100' : 'text-gray-900'}
                            select-none relative py-2 pl-10 pr-4 cursor-pointer`
                    }
                    value={item}
                    >
                    {({ selected, active }) => (
                        <>
                        <span
                            className={`${
                            selected ? 'font-medium' : 'font-normal'
                            } block truncate`}
                        >
                            {item}
                        </span>
                        {selected ? (
                            <span
                            className={`${
                                active ? 'text-blue-600' : 'text-blue-600'
                            }
                                    absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                            </span>
                        ) : null}
                        </>
                    )}
                    </Listbox.Option>
                ))}
                </Listbox.Options>
            </Transition>
            </div>
        </Listbox>
        </div>
    )
}

export default ListeDeroulante;
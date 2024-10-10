import React, { forwardRef } from 'react';

const CustomSelect = forwardRef((props, ref) => {
    return (
        <div className="group text-base flex flex-col rounded-lg bg-tertiary-color border-default-border-color dark:border-dark-default-border-color dark:bg-dark-secondary-color hover:dark:border-dark-accent-color relative hover:rounded-bl-none hover:rounded-br-none w-52">
            
            <div className="bg-tertiary-color dark:bg-dark-secondary-color p-1 rounded-lg items-center cursor-default flex flex-row">
                <div className="w-[10%]">

                </div>
                <div className="flex flex-1 text-sm justify-center pl-2 pr-2">
                    {props.optionZero}
                </div>
                <div className="flex justify-end items-center w-[10%]">
                    <div className="rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-color dark:stroke-dark-primary-color fill-none cursor-pointer">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="
            hidden
            w-52
            transition
            duration-200
            text-sm
            bg-tertiary-color
            dark:bg-dark-secondary-color
            border-default-border-color
            dark:border-dark-default-border-color
            group-hover:absolute
            group-hover:block
            group-hover:z-50
            group-hover:top-full
            group-hover:left-0
            group-hover:rounded-bl-lg
            group-hover:rounded-br-lg
            group-hover:rounded-tl-none
            group-hover:rounded-tr-none
            cursor-pointer">
                {
                    props.selections && Object.keys(props.selections)
                        .sort((a, b) => {
                            const selectionA = props.selections[a].name;
                            const selectionB = props.selections[b].name;

                            return selectionA.localeCompare(selectionB)
                        }
                        )
                        .map((key, index) => (
                            <div onClick={() => (props.changeFunction(props.selections[key].value))} key={index} className="bg-tertiary-color text-grey-text dark:text-dark-grey-text dark:bg-dark-secondary-color hover:bg-primary-color hover:text-secondary-color hover:dark:text-dark-primary-color hover:dark:bg-dark-navbar-hover-bg-color pt-1 pb-1 pl-2 rounded-lg">
                                {props.selections[key].name}
                            </div>
                        ))
                }
            </div>
        </div>
    );
});

export default CustomSelect;
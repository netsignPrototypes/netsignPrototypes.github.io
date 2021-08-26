import React, { useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/outline'

const dataFieldsToCheck = [
    { name: 'Nom', description: 'Nom de famille de la personne fêtée' },
    { name: 'Prénom', description: 'Prénom de la personne fêtée' },
    { name: 'Sexe', description: 'Homme (H) ou Femme (F)' },
    { name: 'Date de naissance', description: 'Date au format AAAA-MM-JJ' }
];

const BirthdayTool = () => {

    const [currentFormStep, setCurrentFormStep] = useState(0);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="bg-white flex flex-col shadow rounded-md overflow-hidden">

                <div className="w-full bg-indigo-50 h-8">

                </div>

                {/* STEP 1 */}
                <div className="flex-auto w-full px-8 py-6">
                    <div className="flex flex-col w-full space-y-3">


                        {dataFieldsToCheck.map((field, index) => {
                            return  (<div key={field.name} className="relative">
                                        <dt>
                                            <div className="absolute flex items-center justify-end mt-1">
                                                <CheckCircleIcon className="w-5 h-5" />
                                            </div>
                                            <p className="ml-8 text-base leading-6 font-medium text-gray-900">{field.name}</p>
                                        </dt>
                                        <dd className="ml-8 text-sm text-gray-500">{field.description}</dd>
                                    </div>)
                        })}

                    </div>
                </div>

                <div className="w-full bg-indigo-50 h-8">
                    
                </div>

            </div>
        </div>
    );
}

export default BirthdayTool;
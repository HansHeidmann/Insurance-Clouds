import { FormBuilderElement } from "../builder/FormBuilderElement";

interface FormFillerProps {
    formName: string; 
    formMatrix: FormBuilderElement[][];
}


/**
*  Need to move the stuff from forms/fill/[id]/page.tsx here to make that page more readable
*  This component will be used to render the form elements in a grid layout
*  It will take the form name and the form matrix as props - ADDED 
*/


const FormFillerArea: React.FC<FormFillerProps> = ({ formName, formMatrix }) => {
    return (
        <div className="p-16 w-[850px]   mx-auto bg-white ">
            <h1 className="text-2xl font-bold mb-4">{formName}</h1>
            <div className="bg-green-100 grid grid-cols-2 gap-4">
                {formMatrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-col space-y-64">
                        {row.map((element) => (
                            <div key={element.id} className={`w-${element.width}`}>
                                {/* Render the form element here */}
                                <p>{element.label}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};


export default FormFillerArea;
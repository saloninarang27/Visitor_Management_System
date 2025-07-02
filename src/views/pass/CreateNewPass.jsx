import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Notification from '../../components/notification';
import { url } from '../../utils/Constants';
import ViewPass from "./ViewPass";

const CreateNewPass = ({ open, onClose, visitor }) => {
    const initialValues = {
        visitor: visitor.id,
        valid_until: '',
        visiting_purpose: '',
        whom_to_visit: '',
        visiting_department: '',
    };

    const steps = ['Visitor Details', 'Meeting Details'];
    const [passData, setPassData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [isConflict, setIsConflict] = useState(false);
    const [previousVisitor, setPreviousVisitor] = useState({});
    const [showViewPass, setShowViewPass] = useState(false);
    const [passCreated, setPassCreated] = useState({});

    useEffect(() => {
        setPassData(currentData => ({
            ...currentData,
            visitor: visitor?.id,
        }));
    }, [visitor]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPassData({ ...passData, [name]: value });
        setErrors({ ...errors, [name]: null });
    };

    const validate = () => {
        let newErrors = {};
        if (activeStep === 1) {
            if (!String(passData.visitor).trim()) newErrors.visitor = 'Visitor ID is required';
            if (!passData.valid_until.trim()) newErrors.valid_until = 'Validity date is required';
        } else if (activeStep === 0) {
            if (!passData.visiting_purpose.trim()) newErrors.visiting_purpose = 'Visiting purpose is required';
            if (!passData.whom_to_visit.trim()) newErrors.whom_to_visit = 'Whom to visit is required';
            if (!passData.visiting_department) newErrors.visiting_department = 'Visiting department is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            if (activeStep < steps.length - 1) {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(prevActiveStep => prevActiveStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const response = await fetch(`${url}/passes/visitor-pass-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(passData),
            });

            const json = await response.json();

            if (response.ok) {
                Notification.showSuccessMessage('Success', 'Pass created successfully');
                setPassCreated(json);
                setShowViewPass(true);
                setPassData(initialValues);
                handleClose();
            } else {
                if (response.status === 409) {
                    const conflictResponse = await fetch(`${url}/passes/view-last-registered-visitor/${passData?.visitor}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const conflictJson = await conflictResponse.json();
                    if (conflictResponse.ok) {
                        setPreviousVisitor(conflictJson);
                        setIsConflict(true);
                    } else {
                        Notification.showErrorMessage('Try Again!', conflictJson.error);
                    }
                }
            }
        } catch (error) {
            Notification.showErrorMessage('Error', 'Server error');
        }
    };

    const handleOverWriteSubmit = async () => {
        if (!validate()) return;
        try {
            const response = await fetch(`${url}/passes/visitor-pass-info/overwrite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(passData),
            });
            const json = await response.json();

            if (response.ok) {
                Notification.showSuccessMessage('Success', 'Pass created successfully');
                setPassCreated(json);
                setShowViewPass(true);
                setPassData(initialValues);
                handleClose();
                setIsConflict(false);
            } else {
                Notification.showErrorMessage('Error', 'Unable To OverWrite Pass');
            }
        } catch (error) {
            Notification.showErrorMessage('Error', 'Server error');
        }
    };

    const handleClose = () => {
        onClose();
        setActiveStep(0);
        setErrors({});
        setPassData(initialValues);
    };

    const stepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <div className="flex flex-col space-y-4">
                        <label className="text-sm font-medium text-gray-700">Visiting Purpose</label>
                        <input
                            type="text"
                            name="visiting_purpose"
                            value={passData.visiting_purpose}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.visiting_purpose ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.visiting_purpose && <div className="text-red-500 text-xs">{errors.visiting_purpose}</div>}

                        <label className="text-sm font-medium text-gray-700">Whom to Visit</label>
                        <input
                            type="text"
                            name="whom_to_visit"
                            value={passData.whom_to_visit}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.whom_to_visit ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.whom_to_visit && <div className="text-red-500 text-xs">{errors.whom_to_visit}</div>}

                        <label className="text-sm font-medium text-gray-700">Visiting Department</label>
                        <select
                            name="visiting_department"
                            value={passData.visiting_department}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.visiting_department ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Department</option>
                            <option value="DG OFFICE">DG OFFICE</option>
                            <option value="EMERGING TECHNOLOGIES">EMERGING TECHNOLOGIES</option>
                            <option value="NETWORKING AND COMMUNICATION">NETWORKING AND COMMUNICATION</option>
                            <option value="FINANCE">FINANCE</option>
                            <option value="ADMINISTRATION">ADMINISTRATION</option>
                        </select>
                        {errors.visiting_department && <div className="text-red-500 text-xs">{errors.visiting_department}</div>}
                    </div>
                );
            case 1:
                return (
                    <div className="flex flex-col space-y-4">
                        <label className="text-sm font-medium text-gray-700">Visitor ID</label>
                        <input
                            type="text"
                            name="visitor"
                            value={passData.visitor}
                            disabled
                            className={`border-2 p-3 rounded-lg ${errors.visitor ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.visitor && <div className="text-red-500 text-xs">{errors.visitor}</div>}

                        <label className="text-sm font-medium text-gray-700">Valid Until</label>
                        <input
                            type="datetime-local"
                            name="valid_until"
                            value={passData.valid_until}
                            onChange={handleInputChange}
                            className={`border-2 p-3 rounded-lg ${errors.valid_until ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.valid_until && <div className="text-red-500 text-xs">{errors.valid_until}</div>}
                    </div>
                );
            default:
                return null;
        }
    };

    const conflictDialog = (
        <Dialog open={isConflict} onClose={() => setIsConflict(false)} fullWidth maxWidth="sm">
            <DialogTitle className="text-lg font-bold text-center">Conflict Detected</DialogTitle>
            <DialogContent className="p-4 text-center">
                <div className="flex justify-center">
                    <div className="h-48 w-48 border-2 rounded-full overflow-hidden bg-customGreen">
                        {previousVisitor.image ? (
                            <img src={`data:image/jpeg;base64,${previousVisitor.image}`} alt="Visitor" />
                        ) : (
                            <div className="h-full flex items-center justify-center text-white bg-customGreen">
                                {previousVisitor.first_name?.charAt(0).toUpperCase() || "N"}
                            </div>
                        )}
                    </div>
                </div>
                <p className="mt-2">Name: {previousVisitor.first_name} {previousVisitor.last_name}</p>
                <p className="mt-2">Pass created on: {new Date(previousVisitor?.created_on).toLocaleString('en-IN')}</p>
            </DialogContent>
            <DialogActions className="justify-evenly">
                <button onClick={() => setIsConflict(false)} className="bg-red-500 text-white px-4 py-2 rounded-md">Cancel</button>
                <button onClick={handleOverWriteSubmit} className="bg-green-500 text-white px-4 py-2 rounded-md">Continue</button>
            </DialogActions>
        </Dialog>
    );

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle className="text-lg font-bold text-center">Create New Pass</DialogTitle>
                <div className="flex items-center justify-between p-3">
                    {steps.map((_, index) => (
                        <div key={index} className={`flex-1 h-2 mx-2 rounded-full ${index <= activeStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    ))}
                </div>
                <div className="px-4 py-5">
                    {stepContent(activeStep)}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleBack}
                            disabled={activeStep === 0}
                            className={`px-4 py-2 text-sm rounded-md ${activeStep === 0 ? 'bg-gray-300' : 'bg-red-500 text-white hover:bg-red-700'}`}
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-700"
                        >
                            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                        </button>
                    </div>
                </div>
            </Dialog>
            {isConflict && conflictDialog}
            {passCreated?.visitor && (
                <ViewPass passData={passCreated} open={showViewPass} onClose={() => setShowViewPass(false)} />
            )}
        </>
    );
};

export default CreateNewPass;

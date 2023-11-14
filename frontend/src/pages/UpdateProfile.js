import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import FileUploader from "../components/services/FileUploader";
import { SnackBarContext } from "../contexts/SnackBarContext";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { PencilFill } from "react-bootstrap-icons";

export default function UpdateProfile() {
    const [show, setShow] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [name, setName] = useState("");
    const { setSB, setOpenSnackBar } = useContext(SnackBarContext);
    const { currentUser, isAdmin, updateUser, uploadImage } =
        useContext(FirebaseContext);

    const handleClose = () => {
        setShow(false);
        setName("");
        setSelectedFile(null);
    };
    const handleShow = () => setShow(true);

    function onFileSelect(file) {
        setSelectedFile(file);
    }

    function handleFormCheck() {
        if (name !== "") {
            updateUser(currentUser, isAdmin, name);
        }
        if (selectedFile) {
            console.log(selectedFile);
            if (
                selectedFile.type === "image/jpeg" ||
                selectedFile.type === "image/png"
            ) {
                console.log("This is the correct format");
                uploadImage(currentUser, selectedFile);
            }
        }
        handleClose();
        setSB({
            msg: "Changes saved, please refresh to update changes",
            severity: "success",
        });
        setOpenSnackBar(true);
    }

    return (
        <div>
            <div>
                <div onClick={handleShow}>
                    <PencilFill size={20}></PencilFill>
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Display Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    type="text"
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter a display name"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Display Picture (JPEG or PNG)
                                </Form.Label>
                                <FileUploader
                                    onFileSelect={onFileSelect}
                                ></FileUploader>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleFormCheck}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

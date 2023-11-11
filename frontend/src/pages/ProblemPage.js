import { FirebaseContext } from "../contexts/FirebaseContext";
var interval_id = null;
var timeout_id = null;
function ProblemPage(props) {
    const { type } = props;
    const {
        currentUser: { uid },
        currentName,
    } = useContext(FirebaseContext);
    const { question } = useContext(QuestionContext);
    const { match } = useContext(MatchContext);
    const {
        message,
        code,
        language,
        snippets,
        setLanguage,
        setCode,
        setMessage,
        setConsoleResult,
    } = useContext(ProblemContext);
    const { openSnackBar, setOpenSnackBar, sb, setSB } =
        useContext(SnackBarContext);
    const [hide, setHide] = useState(true);
    const [textInput, setTextInput] = useState("");
    const [chatHeight, setChatHeight] = useState(100);
    const [editorTheme, setEditorTheme] = useState({
        name: "vs-dark",
        value: "vs-dark",
        key: "vs-dark",
    });
    const [defaultTestCases, setDefaultTestCases] = useState([]);
    const [testCase, setTestCase] = useState({});
    const [stdin, setStdin] = useState();
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBatch, setIsBatch] = useState(false);
    const [batchSubmission, setBatchSubmission] = useState([]);
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const containerRef = useRef(null);
    const interval_ids = useRef({});
    const timeout_ids = useRef({});

    const handleEditorDidMount = useCallback(
        (editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;
            try {
                editorRef.current.getModel().updateOptions({
                    tabSize: 8,
                });
                setCode(
                    snippets?.find((snippet) => {
                        return snippet?.langSlug === language.raw;
                    })?.code
                );
            } catch (e) {
                console.log(e);
            }
        },
        //eslint-disable-next-line
        [snippets, language.raw]
    );

    const handleCloseSnackBar = useCallback((event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackBar(false);
        //eslint-disable-next-line
    }, []);

    // function getCursorPos() {
    //   console.log(editorRef.current.getPosition()); //get current position useful to show peer where you are currently at
    // }
    const onHide = useCallback(() => {
        setHide(true);
        setChatHeight(100);
    }, []);
    const onShow = useCallback(() => {
        setHide(false);
        setChatHeight(60);
    }, []);

    const onSubmitChat = useCallback(
        (e) => {
            if (e.keyCode === 13) {
                let date = new Date();
                const time = `${date.getHours()}:${String(
                    date.getMinutes()
                ).padStart(2, "0")}`;
                let currentMessage = [...message];
                currentMessage.push({
                    user: "me",
                    data: e.target.value,
                    time: time,
                });
                setMessage(currentMessage);
                socket.emit("room-message", match, {
                    user: currentName, //change to username
                    data: e.target.value,
                    time: time,
                });
                setTextInput("");
            }
        },
        //eslint-disable-next-line
        [message, match]
    );
    const getSubmission = useCallback(
        (token) => {
            interval_id = setInterval(async () => {
                const { data } = await axios.get(
                    `http://localhost:5000/api/v1/judge/submission?token=${token}`
                );
                if (data.status.id !== 1 && data.status.id !== 2) {
                    clearInterval(interval_id);
                    clearTimeout(timeout_id);
                    const feedback = {
                        stdout: data.stdout ? atob(data.stdout) : "None",
                        time: data.time,
                        memory: data.memory,
                        stderr: data.stderr ? atob(data.stderr) : "None",
                        compile_output: data.compile_output
                            ? atob(data.compile_output)
                            : "None",
                        message: data.message ? atob(data.message) : "None",
                        status: data.status,
                    };
                    if (type === "coop") {
                        socket.emit("code-submission", match, feedback);
                    }
                    setConsoleResult(feedback);
                    setSB({ msg: "Code Submitted", severity: "success" });
                    setOpenSnackBar(true);
                    setIsRunning(false);
                }
            }, 2000);
        },
        //eslint-disable-next-line
        [match, type]
    );

    const postSubmission = useCallback(
        async (stdin, output) => {
            return await axios.post(
                "http://localhost:5000/api/v1/judge/submission",
                {
                    userID: uid,
                    titleSlug: question["titleSlug"],
                    language_id: language.id,
                    source_code: btoa(code),
                    stdin: btoa(JSON.stringify(stdin)),
                    expected_output: btoa(output.toString()),
                }
            );
        },
        [code, language.id, question.titleSlug, uid]
    );
    const postHistory = useCallback(
        async (feedback) => {
            try {
                const data = {
                    submission: {
                        userID: uid,
                        titleSlug: question["titleSlug"],
                        language_id: language.id,
                        source_code: code,
                    },
                    feedback,
                };
                await axios.post(
                    `http://localhost:5000/api/v1/question/history`,
                    data
                );
            } catch (e) {
                console.log(e);
            }
        },
        [code, language.id, question.titleSlug, uid]
    );
    //Submit Button to run against all default test cases
    const onSubmit = () => {
        try {
            setBatchSubmission([]);
            setConsoleResult("");
            const outputs = getExpectedOutput();
            defaultTestCases.forEach(async (tc, index) => {
                const response = await postSubmission(tc, outputs[index]); //post submission to judge0 and poll 10s for feedback
                timeout_ids.current[index] = setTimeout(() => {
                    clearInterval(interval_ids.current[index]);
                }, 10000);
                interval_ids.current[index] = setInterval(async () => {
                    const { data } = await axios.get(
                        `http://localhost:5000/api/v1/judge/submission?token=${response.data.token}`
                    );
                    if (data.status.id !== 1 && data.status.id !== 2) {
                        //if submission is ready stop polling
                        const feedback = {
                            token: response.data.token,
                            stdout: data.stdout ? atob(data.stdout) : "None",
                            time: data.time,
                            memory: data.memory,
                            stderr: data.stderr ? atob(data.stderr) : "None",
                            compile_output: data.compile_output
                                ? atob(data.compile_output)
                                : "None",
                            message: data.message ? atob(data.message) : "None",
                            status: data.status,
                            finished_at: data?.finished_at,
                            expected_output: outputs[index],
                        };
                        setBatchSubmission((prevState) => [
                            ...prevState,
                            feedback,
                        ]);
                        clearInterval(interval_ids.current[index]);
                        clearTimeout(timeout_ids.current[index]);
                    }
                }, 2000);
            });
            setIsBatch(true); //change Result tab content to 'Batch' instead of 'Single'
            setIsSubmitting(true);
        } catch (e) {
            console.log(e.message);
        }
    };
    //Run button to run against user selected testcase
    const onRun = useCallback(async () => {
        try {
            const { data } = await postSubmission(stdin, testCase?.output);
            setIsRunning(true);
            timeout_id = setTimeout(() => {
                clearInterval(interval_id);
                setSB({ msg: "Submission timedout", severity: "error" });
                setOpenSnackBar(true);
                setIsRunning(false);
            }, 10000);
            setIsBatch(false);
            getSubmission(data.token);
        } catch (e) {
            console.log(e.message);
        }
        //eslint-disable-next-line
    }, [stdin, testCase, code, language.id, question.titleSlug, uid]);

    const handleLanguageChange = useCallback(
        (event) => {
            setLanguage(JSON.parse(event.target.value));
            if (type === "coop") {
                socket.emit("code-language", match, event.target.value);
            }
            setCode(
                snippets?.find((snippet) => {
                    return (
                        snippet.langSlug === JSON.parse(event.target.value).raw
                    );
                })?.code
            );
        },
        //eslint-disable-next-line
        [type, match, snippets]
    );
    const handleThemeChange = useCallback((event) => {
        const theme = JSON.parse(event.target.value);
        if (["light", "vs-dark"].includes(theme.name)) {
            setEditorTheme(theme);
        } else {
            defineTheme(theme.value).then((_) => setEditorTheme(theme));
        }
      );
      setIsSubmitting(true);
      timeout_id = setTimeout(() => {
        clearInterval(interval_id);
        setSB({ msg: "Submission timedout", severity: "error" });
        setOpenSnackBar(true);
        setIsSubmitting(false);
      }, 10000);
      getSubmissionAndSubmit(data.token);
    } catch (e) {
      console.log(e.message);
    }
  };
  const onRun = useCallback(async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/judge/submission",
        {
          userID: "1234",
          titleSlug: question["titleSlug"],
          language_id: language.id,
          source_code: btoa(code),
          stdin: btoa(
            stdin ? JSON.stringify(stdin) : JSON.stringify(defaultTestCases[0])
          ),
        }
      );
      setIsRunning(true);
      timeout_id = setTimeout(() => {
        clearInterval(interval_id);
        setSB({ msg: "Submission timedout", severity: "error" });
        setOpenSnackBar(true);
        setIsRunning(false);
      }, 10000);
      getSubmission(data.token);
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, [code, match, question, language.id, type, stdin, defaultTestCases]);

  const handleLanguageChange = useCallback(
    (event) => {
      setLanguage(JSON.parse(event.target.value));
      if (type === "coop") {
        socket.emit("code-language", match, event.target.value);
      }
      setCode(
        snippets?.find((snippet) => {
          return snippet.langSlug === JSON.parse(event.target.value).raw;
        })?.code
      );
    },
    //eslint-disable-next-line
    [type, match, snippets]
  );
  const handleThemeChange = useCallback((event) => {
    const theme = JSON.parse(event.target.value);
    if (["light", "vs-dark"].includes(theme.name)) {
      setEditorTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setEditorTheme(theme));
    }
  }, []);

  const handleCodeChanges = useCallback(
    (code) => {
      setCode(code);
      if (type === "coop") {
        socket.emit("code-changes", match, code);
      }
    },
    //eslint-disable-next-line
    [match, type]
  );

  const handleLeaveRoom = useCallback(() => {
    if (type === "coop") {
      socket.emit("match-quit", match);
      setSB({ msg: "Requested to quit session...", severity: "success" });
      setOpenSnackBar(true);
    }
    //eslint-disable-next-line
  }, [match, type]);

  const getDefaultTestCases = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/question/exampletestcase`,
      {
        params: { titleSlug: question?.titleSlug },
      }
    );
    const testcases = data?.testCases?.map((tc) => {
      const arr = tc.split("\n").map((param, index) => {
        return {
          [JSON.parse(data.metaData).params[index].name]: param,
        };
      });
      return Object.assign(...arr);
    });
    setDefaultTestCases(testcases);
  };
  useEffect(() => {
    //get Test case here once
    getDefaultTestCases();
    return () => {
      clearInterval(interval_id);
      clearTimeout(timeout_id);
    };
    //eslint-disable-next-line
  }, []);

  function generateCodeTranslatePrompt(inputLanguage, outputLanguage) {
    let prompt = `You are an expert programmer in all programming languages. Translate the "${inputLanguage}" code to "${outputLanguage}" code. Do not include \`\`\`.
  
    Example translating from JavaScript to Python:

    JavaScript code:
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }

    Python code:
    for i in range(10):
      print(i)
    
    ${inputLanguage} code:
    ${code}

    ${outputLanguage} code (no \`\`\`):`
    return prompt;
  }

  const onCodeTranslationRequest =
    async (e) => {
      if (translateToLanguage === ""){
        setSB({ msg: "Please input a coding language to translate to!", severity: "error" });
        setOpenSnackBar(true);
        return;
      }
      let prompt = generateCodeTranslatePrompt(language.raw, translateToLanguage.raw);
      await axios
        .post("http://localhost:8020/ask", { prompt })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.includes("maximum context length")) {
              setSB({ msg: "You have exceeded the maximum prompt length, please shorten your prompt!", severity: "error" });
              setOpenSnackBar(true);
            } else {
              setSB({ msg: "Translation of code successful!", severity: "success" });
              setOpenSnackBar(true);
              setTranslatedCode(res.data);
            }
          }
        })
        .catch((error) => console.log(error));
    }


  function onCodeTranslateQuery() {
    setShowCodeTranslate(true);
  }

  function onCodeTranslateConfirmation() {
    setLanguage(translateToLanguage)
    setCode(translatedCode)
    setTranslatedCode("")
    handleClose()
  }

  function handleTranslateLanguageChange(event) {
    setTranslateToLanguage(JSON.parse(event.target.value));
  }

  function handleTranslatedCodeChanges(translatedCode) {
    setTranslatedCode(translatedCode)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '70%',
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  let theme = createTheme({
    shape: {
      pillRadius: 50
    }
  });


  const handleClose = () => setShowCodeTranslate(false);

  return (
    <>
      <SnackBar
        msg={sb?.msg}
        handleCloseSnackBar={handleCloseSnackBar}
        openSnackBar={openSnackBar}
        severity={sb?.severity}
      />

      {showCodeTranslate && <div style={{ margin: '50%' }}>
        <Modal
          open={showCodeTranslate}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <CustomSelect
              title={"Language"}
              list={EDITOR_SUPPORTED_LANGUAGES}
              value={translateToLanguage}
              handleChange={handleTranslateLanguageChange}
            />
            <Typography id="modal-modal-title" variant="h5" component="h2">
              Translate your current code here from {language.name} to {translateToLanguage.name}
            </Typography>

            <ThemeProvider theme={theme}>
              <Button variant="contained" pill onClick={onCodeTranslationRequest}>
                TRANSLATE
              </Button>
            </ThemeProvider>

            <div className="translator-container">
              <div className="translator-component">
                <h3>Original Code</h3>
                <Editor
                  height="80%"
                  language={language?.raw}
                  theme={editorTheme?.value}
                  value={code}
                  onChange={handleCodeChanges}
                  onMount={handleEditorDidMount}
                  options={{
                    dragAndDrop: false,
                    inlineSuggest: true,
                    fontSize: "16px",
                    formatOnType: true,
                    autoClosingBrackets: true,
                    minimap: { scale: 10 },
                  }}
                />
              </div>

              <div className="translator-component">
                <h3>Translated Code</h3>
                <Editor
                  height="80%"
                  language={translateToLanguage?.raw}
                  theme={editorTheme?.value}
                  value={translatedCode}
                  onChange={handleTranslatedCodeChanges}
                  onMount={handleTranslatedEditorDidMount}
                  options={{
                    dragAndDrop: false,
                    inlineSuggest: true,
                    fontSize: "16px",
                    formatOnType: true,
                    autoClosingBrackets: true,
                    minimap: { scale: 10 },
                  }}
                />
              </div>
        );
        const testcases = data?.testCases?.map((tc) => {
            const arr = tc.split("\n").map((param, index) => {
                return {
                    [JSON.parse(data.metaData).params[index].name]: param,
                };
            });
            return Object.assign(...arr);
        });
        const expected = getExpectedOutput();
        testcases?.map((tc, index) => {
            return (tc["output"] = expected[index]);
        });
        setDefaultTestCases(testcases);
        setTestCase(testcases?.at(0) || {});
    };

    const getExpectedOutput = useCallback(() => {
        return question?.problem
            .split("\n")
            .map((line) => {
                if (line?.toString().toLowerCase().indexOf("output") !== -1) {
                    return line
                        ?.substring(line.indexOf("</strong>") + 9)
                        .trim();
                }
            })
            .filter((element) => {
                return element !== undefined;
            });
    }, [question.problem]);

    useEffect(() => {
        //get Test case here once
        getDefaultTestCases();
        return () => {
            clearInterval(interval_id);
            clearTimeout(timeout_id);
        };
        //eslint-disable-next-line
    }, []);
    useEffect(() => {
        try {
            if (testCase) {
                const arr = Object.keys(testCase)
                    ?.filter((key) => key !== "output")
                    ?.map((key) => {
                        return { [key]: testCase[key] };
                    });
                if (arr.length > 0) {
                    const obj = Object.assign(...arr);
                    setStdin(obj);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }, [testCase]);

    useEffect(() => {
        if (chatHeight >= 100) {
            setHide(true);
        }
    }, [chatHeight]);

    useEffect(() => {
        // Priority Error > WA > TLE > AC
        if (
            batchSubmission.length === defaultTestCases.length &&
            batchSubmission.length > 0 &&
            isSubmitting
        ) {
            const errorIndex = batchSubmission.findIndex(
                (feedback) =>
                    feedback.status.description
                        .toLowerCase()
                        .indexOf("error") !== -1
            );
            const WrongIndex = batchSubmission.findIndex(
                (feedback) => feedback.status.id === 4
            );
            const TLEIndex = batchSubmission.findIndex(
                (feedback) => feedback.status.id === 5
            );

            if (errorIndex !== -1) {
                postHistory(batchSubmission[errorIndex]);
            } else if (WrongIndex !== -1) {
                postHistory(batchSubmission[WrongIndex]);
            } else if (TLEIndex !== -1) {
                postHistory(batchSubmission[TLEIndex]);
            } else {
                postHistory(batchSubmission[0]);
            }
            setIsSubmitting(false);
        }
    }, [batchSubmission]);

    return (
        <>
            <SnackBar
                msg={sb?.msg}
                handleCloseSnackBar={handleCloseSnackBar}
                openSnackBar={openSnackBar}
                severity={sb?.severity}
            />
            <div className="problem-page-container">
                <div className="problem-tabs-container">
                    <ProblemPageTabs userID={uid} question={question} />
                </div>
                <div className="editor-container" ref={containerRef}>
                    <EditorOptions
                        language={language}
                        editorTheme={editorTheme}
                        handleLanguageChange={handleLanguageChange}
                        handleThemeChange={handleThemeChange}
                    >
                        {type === "coop" && (
                            <ConsoleButton
                                title={"Leave"}
                                onClick={handleLeaveRoom}
                                sx={{
                                    ml: "auto",
                                    backgroundColor: "red",
                                    mb: 1,
                                }}
                            />
                        )}
                    </EditorOptions>

                    <div
                        className="editor-component"
                        style={{ height: `${chatHeight}%` }}
                    >
                        <Editor
                            height="100%"
                            language={language?.raw}
                            theme={editorTheme?.value}
                            value={code}
                            onChange={handleCodeChanges}
                            onMount={handleEditorDidMount}
                            options={{
                                dragAndDrop: false,
                                inlineSuggest: true,
                                fontSize: "16px",
                                formatOnType: true,
                                autoClosingBrackets: true,
                                minimap: { scale: 10 },
                            }}
                        />
                    </div>
                    <ResizeBar
                        setHeight={setChatHeight}
                        containerRef={containerRef}
                    />
                    <div
                        className="console-tabs-container"
                        style={{
                            flex: 1,
                            display: hide ? "none" : "flex",
                            height: `${100 - chatHeight}%`,
                        }}
                    >
                        <ConsoleTabs
                            onSubmitChat={onSubmitChat}
                            setTextInput={setTextInput}
                            textInput={textInput}
                            chatDisabled={type !== "coop"}
                            defaultTestCases={defaultTestCases}
                            setTestCase={setTestCase}
                            testCase={testCase}
                            batchSubmission={batchSubmission}
                            isBatch={isBatch}
                        />
                    </div>
                    <div className="console-options">
                        {hide ? (
                            <ConsoleButton
                                onClick={onShow}
                                icon={<KeyboardArrowUpIcon />}
                                title={"Console"}
                            />
                        ) : (
                            <ConsoleButton
                                icon={<KeyboardArrowDownIcon />}
                                onClick={onHide}
                                title={"Console"}
                            />
                        )}
                        <ConsoleButton
                            onClick={onRun}
                            title={"Run"}
                            loading={isRunning ? isRunning : undefined}
                            disabled={isSubmitting}
                            sx={{ ml: "auto", mr: 1 }}
                        />
                        <ConsoleButton
                            onClick={onSubmit}
                            title={"Submit"}
                            loading={isSubmitting ? isSubmitting : undefined}
                            disabled={isRunning}
                            sx={{ backgroundColor: "green" }}
                        />
                    </div>
                </div>
            </div>
            <ThemeProvider theme={theme}>
              <Button variant="contained" pill onClick={onCodeTranslateConfirmation}>
                CONFIRM CHANGES
              </Button>
            </ThemeProvider>
          </Box>
        </Modal>
      </div>}

      <div className="problem-page-container">
        <div className="problem-tabs-container">
          <ProblemPageTabs userID={"1234"} question={question} />
        </div>
        <div className="editor-container" ref={containerRef}>
          <EditorOptions
            language={language}
            editorTheme={editorTheme}
            handleLanguageChange={handleLanguageChange}
            handleThemeChange={handleThemeChange}
          >
            {type === "coop" && (
              <ConsoleButton
                title={"Leave"}
                onClick={handleLeaveRoom}
                sx={{
                  ml: "auto",
                  backgroundColor: "red",
                  mb: 1,
                }}
              />
            )}
          </EditorOptions>

          <div
            className="editor-component"
            style={{ height: `${chatHeight}%` }}
          >
            <Editor
              height="100%"
              language={language?.raw}
              theme={editorTheme?.value}
              value={code}
              onChange={handleCodeChanges}
              onMount={handleEditorDidMount}
              options={{
                dragAndDrop: false,
                inlineSuggest: true,
                fontSize: "16px",
                formatOnType: true,
                autoClosingBrackets: true,
                minimap: { scale: 10 },
              }}
            />
          </div>
          <ResizeBar setHeight={setChatHeight} containerRef={containerRef} />
          <div
            className="console-tabs-container"
            style={{
              flex: 1,
              display: hide ? "none" : "flex",
              height: `${100 - chatHeight}%`,
            }}
          >
            <ConsoleTabs
              onSubmitChat={onSubmitChat}
              onSubmitAIChat={onSubmitAIChat}
              setTextInput={setTextInput}
              textInput={textInput}
              aiTextInput={aiTextInput}
              setAITextInput={setAITextInput}
              chatDisabled={type !== "coop"}
              defaultTestCases={defaultTestCases}
              setStdin={setStdin}
            />
          </div>
          <div className="console-options">
            {hide ? (
              <ConsoleButton
                onClick={onShow}
                icon={<KeyboardArrowUpIcon />}
                title={"Console"}
              />
            ) : (
              <ConsoleButton
                icon={<KeyboardArrowDownIcon />}
                onClick={onHide}
                title={"Console"}
              />
            )}
            <ConsoleButton
              onClick={onCodeTranslateQuery}
              title={"AI Code Translation Tool"}
              sx={{ ml: "auto", mr: 1 }}
            />

            <ConsoleButton
              onClick={onRun}
              title={"Run"}
              loading={isRunning ? isRunning : undefined}
              disabled={isSubmitting}
              sx={{ ml: "auto", mr: 1 }}
            />
            <ConsoleButton
              onClick={onSubmit}
              title={"Submit"}
              loading={isSubmitting ? isSubmitting : undefined}
              disabled={isRunning}
              sx={{ backgroundColor: "green" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ProblemPage);

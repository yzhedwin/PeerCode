import {
    EDITOR_SUPPORTED_LANGUAGES,
    EDITOR_SUPPORTED_THEMES,
} from "../../../utils/constants";
import CustomSelect from "./CustomSelect";

function EditorOptions({
    language,
    handleLanguageChange,
    handleThemeChange,
    editorTheme,
    children,
}) {
    return (
        <div className="editor-options">
            <div id="select">
                <CustomSelect
                    title={"Language"}
                    list={EDITOR_SUPPORTED_LANGUAGES}
                    value={language}
                    handleChange={handleLanguageChange}
                />
            </div>
            <div id="select">
                <CustomSelect
                    title={"Theme"}
                    list={Object.entries(EDITOR_SUPPORTED_THEMES).map(
                        ([themeId, themeName]) => ({
                            name: themeName,
                            value: themeId,
                            key: themeId,
                        })
                    )}
                    value={editorTheme}
                    handleChange={handleThemeChange}
                />
            </div>
            {children}
        </div>
    );
}

export default EditorOptions;

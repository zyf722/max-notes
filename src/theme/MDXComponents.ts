// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react"; // This import is necessary to make JSX work in MDX.
import MDXComponents from "@theme-original/MDXComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fab, fas, far); // Add all icons to the library so you can use them without importing them individually.

export default {
    // Re-use the default mapping
    ...MDXComponents,
    FAIcon: FontAwesomeIcon,
};

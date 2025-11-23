// utils/notification.ts
import { toast, ToastOptions, type Toast } from "react-hot-toast";

// --- ADDED: Custom Component for the toast content ---
type NotificationContentProps = {
    t: Toast; // This 't' object is provided by react-hot-toast
    title: string;
    message: string;
};

/**
 * A custom component that includes a title, message, and a close button.
 */
const NotificationContent = ({ t, title, message }: NotificationContentProps) => {
    return (
        // We use display: flex to put the content and button side-by-side.
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: "16px", // Adds space between text and button
            }}
        >
            {/* Left side: Title and Message */}
            <div>
                <b style={{ fontSize: "15px" }}>{title}</b>
                <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>{message}</p>
            </div>

            {/* Right side: Close Button */}
            <button
                onClick={() => toast.dismiss(t.id)} // This dismisses the specific toast
                style={{
                    border: "1px solid #ccc",
                    background: "transparent",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    flexShrink: 0, // Prevents the button from shrinking
                }}
            >
                Close
            </button>
        </div>
    );
};
// --- END ADDED ---

// Define a type for the notification props
type NotificationProps = {
    title: string;
    message: string;
    color: "blue" | "red" | "green" | "black";
};

/**
 * Shows a toast notification.
 */
export const showNotification = ({
    title,
    message,
    color,
}: NotificationProps) => {
    // Common options: persistent duration
    const toastOptions: ToastOptions = {
        duration: Infinity,
        // We can add some styles to the toast itself
        style: {
            minWidth: "300px", // Ensure it has enough space
        },
    };

    // --- MODIFIED: How we call the toast ---
    // Instead of passing a string, we pass a function.
    // This function receives the 't' (toast) object.
    // We then render our custom component, passing 't' to it.

    const renderToast = (t: Toast) => (
        <NotificationContent t={t} title={title} message={message} />
    );

    // Map your color prop to the correct toast function
    switch (color) {
        case "red":
            toast.error(renderToast, toastOptions); // Pass the render function
            break;
        case "green":
            toast.success(renderToast, toastOptions); // Pass the render function
            break;
        case "blue":
            toast(renderToast, {
                ...toastOptions,
                icon: "ℹ️",
            });
            break;
        default:
            toast(renderToast, toastOptions); // Pass the render function
            break;
    }
};
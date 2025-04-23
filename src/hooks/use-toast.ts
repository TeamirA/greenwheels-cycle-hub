
import * as React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
      id: string;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
              }
            : t
        ),
      };
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatchCustomEvent({
      type: "REMOVE_TOAST",
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

interface ToasterProps {
  toasts: ToasterToast[];
}

// Define the dispatch object correctly
const listeners: Array<(action: Action) => void> = [];

function subscribe(listener: (action: Action) => void) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

function dispatchCustomEvent(action: Action) {
  listeners.forEach((listener) => listener(action));
}

function useToast() {
  const [state, setState] = React.useState<State>({
    toasts: [],
  });

  React.useEffect(() => {
    return subscribe((action) => {
      setState((prevState) => reducer(prevState, action));
    });
  }, []);

  return {
    ...state,
    toast: (props: Omit<ToasterToast, "id">) => {
      const id = genId();
      const update = (props: Partial<ToasterToast>) => {
        dispatchCustomEvent({
          type: "UPDATE_TOAST",
          toast: props,
          id,
        });
      };
      
      dispatchCustomEvent({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
        },
      });
      
      return {
        id,
        update,
        dismiss: () => dispatchCustomEvent({ type: "DISMISS_TOAST", toastId: id }),
      };
    },
    dismiss: (toastId?: string) => {
      dispatchCustomEvent({ type: "DISMISS_TOAST", toastId });
    },
  };
}

// Export both the custom hook and a toast function for convenience
export { useToast };
export const toast = (props: Omit<ToasterToast, "id">) => {
  const id = genId();
  
  dispatchCustomEvent({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
    },
  });
  
  return {
    id,
    update: (props: Partial<ToasterToast>) => 
      dispatchCustomEvent({
        type: "UPDATE_TOAST",
        toast: props,
        id,
      }),
    dismiss: () => dispatchCustomEvent({ type: "DISMISS_TOAST", toastId: id }),
  };
};

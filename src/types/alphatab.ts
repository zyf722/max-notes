import { Settings } from "@coderline/alphatab";

type NestedPartial<T> = {
    [K in keyof T]?: T[K] extends Array<infer R>
        ? Array<NestedPartial<R>>
        : NestedPartial<T[K]>;
};

export type PartialSettings = NestedPartial<Settings>;

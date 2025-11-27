"use client";

import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import NestedSortableItem from "./NestedSortableItem";

export default function MenuTree({ items, level = 0, renderItem }) {
    if (!items || !items.length) return null;

    return (
        <SortableContext
            items={items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
        >
            {items.map(item => (
                <div
                    key={item.id}
                    style={{
                        marginLeft: level * 25,
                        paddingTop: 4,
                        paddingBottom: 4,
                    }}
                >
                    <NestedSortableItem id={item.id}>
                        {renderItem(item)}
                    </NestedSortableItem>

                    {item.children?.length > 0 && (
                        <MenuTree
                            items={item.children}
                            level={level + 1}
                            renderItem={renderItem}
                        />
                    )}
                </div>
            ))}
        </SortableContext>
    );
}

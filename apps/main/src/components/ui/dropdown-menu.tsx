"use client";

import { CaretRightIcon, CheckIcon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import type * as React from "react";
import {
	composeRenderProps,
	Header as HeaderPrimitive,
	MenuItem as MenuItemPrimitive,
	type MenuItemProps as MenuItemPrimitiveProps,
	Menu as MenuPrimitive,
	MenuSection as MenuSectionPrimitive,
	type MenuSectionProps as MenuSectionPrimitiveProps,
	MenuTrigger as MenuTriggerPrimitive,
	Popover as PopoverPrimitive,
	Separator as SeparatorPrimitive,
	SubmenuTrigger as SubmenuTriggerPrimitive,
} from "react-aria-components";
import { cn } from "$/src/lib/utils/cn";

function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof MenuTriggerPrimitive>) {
	return <MenuTriggerPrimitive data-slot='dropdown-menu-trigger' {...props} />;
}

function DropdownMenu({
	"data-slot": dataSlot = "dropdown-menu-content",
	placement = "bottom start",
	offset = 4,
	crossOffset = 0,
	className,
	children,
	...props
}: Omit<React.ComponentProps<typeof MenuPrimitive<object>>, "children" | "className"> &
	Pick<React.ComponentProps<typeof PopoverPrimitive>, "placement" | "offset" | "crossOffset"> & {
		"data-slot"?: string;
		className?: string;
		children?: React.ReactNode;
	}) {
	return (
		<PopoverPrimitive
			data-slot={dataSlot}
			placement={placement}
			offset={offset}
			crossOffset={crossOffset}
			className={cn(
				"data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:fade-out-0 data-exiting:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 relative z-50 w-(--trigger-width) min-w-48 origin-(--trigger-anchor-point) animate-none! overflow-y-auto overflow-x-hidden rounded-3xl bg-popover/70 p-1.5 text-popover-foreground shadow-lg outline-none ring-1 ring-foreground/5 duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 data-entering:animate-in data-exiting:animate-out data-exiting:overflow-hidden **:data-[slot$=-item]:data-focused:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[variant=destructive]:**:text-accent-foreground! **:data-[variant=destructive]:text-accent-foreground! **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[variant=destructive]:focus:bg-foreground/10! dark:ring-foreground/10",
				className,
			)}
		>
			<MenuPrimitive className='max-h-[inherit] overflow-y-auto overflow-x-hidden outline-hidden' {...props}>
				{children}
			</MenuPrimitive>
		</PopoverPrimitive>
	);
}

function DropdownMenuGroup({
	...props
}: Omit<MenuSectionPrimitiveProps<object>, "children"> & {
	children?: React.ReactNode;
}) {
	return <MenuSectionPrimitive data-slot='dropdown-menu-group' {...props} />;
}

function DropdownMenuLabel({
	className,
	inset,
	...props
}: React.ComponentProps<typeof HeaderPrimitive> & {
	inset?: boolean;
}) {
	return (
		<HeaderPrimitive
			data-slot='dropdown-menu-label'
			data-inset={inset}
			className={cn("px-3 py-2.5 text-muted-foreground text-xs data-inset:pl-9.5", className)}
			{...props}
		/>
	);
}

const dropdownMenuItemVariants = cva(
	"group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			selectionMode: {
				none: "gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-9.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
				single:
					"gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-9.5 [&_svg:not([class*='size-'])]:size-4",
				multiple:
					"gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-9.5 [&_svg:not([class*='size-'])]:size-4",
			},
		},
	},
);

function DropdownMenuItem({
	className,
	inset,
	variant = "default",
	children,
	...props
}: MenuItemPrimitiveProps<object> & {
	inset?: boolean;
	variant?: "default" | "destructive";
}) {
	return (
		<MenuItemPrimitive
			data-slot='dropdown-menu-item'
			data-inset={inset}
			data-variant={variant}
			textValue={typeof children === "string" ? children : props.textValue}
			className={composeRenderProps(className, (className, { selectionMode }) =>
				cn(dropdownMenuItemVariants({ selectionMode }), className),
			)}
			{...props}
		>
			{composeRenderProps(children, (children, { isSelected, selectionMode }) => (
				<>
					{selectionMode !== "none" ? (
						<span
							className='pointer-events-none absolute right-2 flex items-center justify-center'
							data-slot={
								selectionMode === "single"
									? "dropdown-menu-radio-item-indicator"
									: "dropdown-menu-checkbox-item-indicator"
							}
						>
							{isSelected ? <CheckIcon /> : null}
						</span>
					) : null}
					{children}
				</>
			))}
		</MenuItemPrimitive>
	);
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof SubmenuTriggerPrimitive>) {
	return <SubmenuTriggerPrimitive data-slot='dropdown-menu-sub' {...props} />;
}

function DropdownMenuSubTrigger({
	className,
	inset,
	children,
	...props
}: MenuItemPrimitiveProps<object> & {
	inset?: boolean;
}) {
	return (
		<MenuItemPrimitive
			data-slot='dropdown-menu-sub-trigger'
			data-inset={inset}
			textValue={typeof children === "string" ? children : props.textValue}
			className={cn(
				"flex cursor-default select-none items-center gap-2 rounded-2xl px-3 py-2 font-medium text-sm outline-hidden focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-open:bg-accent data-inset:pl-9.5 data-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				className,
			)}
			{...props}
		>
			{composeRenderProps(children, (children) => (
				<>
					{children}
					<CaretRightIcon className='ml-auto' />
				</>
			))}
		</MenuItemPrimitive>
	);
}

function DropdownMenuSubContent({
	placement = "end top",
	crossOffset = -3,
	offset = 0,
	className,
	...props
}: React.ComponentProps<typeof DropdownMenu>) {
	return (
		<DropdownMenu
			data-slot='dropdown-menu-sub-content'
			className={cn(
				"relative w-auto min-w-36 animate-none! rounded-3xl bg-popover/70 p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[variant=destructive]:**:text-accent-foreground! **:data-[variant=destructive]:text-accent-foreground! **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[variant=destructive]:focus:bg-foreground/10! dark:ring-foreground/10",
				className,
			)}
			placement={placement}
			crossOffset={crossOffset}
			offset={offset}
			{...props}
		/>
	);
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof SeparatorPrimitive>) {
	return (
		<SeparatorPrimitive
			data-slot='dropdown-menu-separator'
			className={cn("-mx-1.5 my-1.5 h-px bg-border/50", className)}
			{...props}
		/>
	);
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot='dropdown-menu-shortcut'
			className={cn(
				"ml-auto text-muted-foreground text-xs tracking-widest group-focus/dropdown-menu-item:text-accent-foreground",
				className,
			)}
			{...props}
		/>
	);
}

export {
	DropdownMenu,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
};

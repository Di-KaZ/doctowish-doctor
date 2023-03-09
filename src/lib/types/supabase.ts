export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			appointment: {
				Row: {
					date: string | null;
					doctor: number | null;
					id: number;
					name: string | null;
					patient: number | null;
				};
				Insert: {
					date?: string | null;
					doctor?: number | null;
					id?: number;
					name?: string | null;
					patient?: number | null;
				};
				Update: {
					date?: string | null;
					doctor?: number | null;
					id?: number;
					name?: string | null;
					patient?: number | null;
				};
			};
			user_info: {
				Row: {
					firstName: string | null;
					id: number;
					name: string | null;
					profession: string | null;
					type: string | null;
					user: string | null;
				};
				Insert: {
					firstName?: string | null;
					id?: number;
					name?: string | null;
					profession?: string | null;
					type?: string | null;
					user?: string | null;
				};
				Update: {
					firstName?: string | null;
					id?: number;
					name?: string | null;
					profession?: string | null;
					type?: string | null;
					user?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

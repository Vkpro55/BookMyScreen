export interface IError {
  field?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: IError | IError[];
}

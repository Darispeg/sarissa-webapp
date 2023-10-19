import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { Project,  } from "../../projects.types";
import { ApolloQueryResult } from "@apollo/client/core";
import { ADD_CORRECTIVE_ACTION_TO_SOLUTION, CREATE_SOLUTION, GET_SOLUTIONS_BY_PROJECT_ID, GET_SOLUTION_BY_ID, REMOVE_CORRECTIVE_ACTION_TO_SOLUTION, UPDATE_MEMBER_VALIDATE_SOLUTION, UPDATE_SOLUTION_BY_ID } from "./solutions-query.graphql";
import { CorrectiveActions, SolutionDetails, SolutionDetailsRequest, SolutionInfo } from "./solutions.types";

@Injectable({
    providedIn: 'root'
})
export class SolutionsService
{
    private _solution: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _solutions: BehaviorSubject<SolutionInfo[] | null> = new BehaviorSubject(null);
    private _corrective_actions: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _project : BehaviorSubject<Project | null> = new BehaviorSubject(null);
    private _new: string = '000000000000000000000000';

    constructor(private _apollo: Apollo){}

    get project$(): Observable<Project>
    {
        return this._project.asObservable();
    }

    get corrective_actions$(): Observable<CorrectiveActions[]>
    {
        return this._corrective_actions.asObservable();
    }

    get solution$(): Observable<SolutionDetails>
    {
        return this._solution.asObservable();
    }

    get solutions$(): Observable<SolutionInfo[]>
    {
        return this._solutions.asObservable();
    }

    getSolutionsByProjectId(id: string): Observable<ApolloQueryResult<Object>>
    {
        return this._apollo.query({
                    query: GET_SOLUTIONS_BY_PROJECT_ID,
                    variables: {
                        getProjectId: id
                    },
                }).pipe(
                    tap((result: any) => {
                        this._project.next(result.data?.getProject);
                        this._solutions.next(result.data?.getProject.solutions);
                    })
                );
    }

    getSolutionByKey(id: String): Observable<any>
    {
        if(id === this._new)
        {
            return this._solutions.pipe(
                take(1),
                map(() => {
                    const solution : SolutionDetails = {
                        id : '',
                        title: '',
                        description: '',
                        trigger  : '',
                        created : '',
                        modified : '',
                        members : [],
                        corrective_actions : [],
                    };
                    this._solution.next(solution);
                    return solution;
                })
            );
        }

        return this._apollo.query({
                query: GET_SOLUTION_BY_ID,
                variables: {
                  getSolutionId: id
                },
            }).pipe(
                tap((result: any) => {
                    this._solution.next(result.data?.getSolution);
                })
            );
    }


    updateMemberValidateSolution(solutionId: string, memberId: String, updateValidation: String): Observable<ApolloQueryResult<Object>> {
        return this.solutions$.pipe(
          take(1),
          switchMap(solutions => {
            return this._apollo.mutate({
              mutation: UPDATE_MEMBER_VALIDATE_SOLUTION,
              variables: {
                solutionId: solutionId,
                memberId: memberId,
                updateValidation : updateValidation
              },
            }).pipe(
              map((result: any) => {
                const updatedSolutions = solutions.map(solution => {
                  if (solution.id === solutionId) {
                    return result.data?.updateMemberValidation;
                  }
                  return solution;
                });

                this._solutions.next(updatedSolutions);
                this._solution.next(result.data?.updateMemberValidation);
                this._corrective_actions.next(result.data?.updateMemberValidation.corrective_actions);
      
                return result.data?.updateMemberValidation;
              }),
              catchError((error) => {
                return throwError(error);
              })
            );
          })
        );
    }

    findCorrectiveActionsBySolutionId(solutionId: String) : Observable<CorrectiveActions[]>
    {
        const solution = this._solutions.value.find(i => i.id === solutionId);

        if (solution) {
          this._corrective_actions.next(solution.corrective_actions);
          return this._corrective_actions.asObservable();
        } else {
          return throwError("La solución no se encontró");
        }
    }

    addCorrectiveAction(solutionId: string, action: any): Observable<ApolloQueryResult<Object>> {
        return this.solutions$.pipe(
          take(1),
          switchMap(solutions => {
            return this._apollo.mutate({
              mutation: ADD_CORRECTIVE_ACTION_TO_SOLUTION,
              variables: {
                solutionId: solutionId,
                action: action
              },
            }).pipe(
              map((result: any) => {
                const updatedSolutions = solutions.map(solution => {
                  if (solution.id === solutionId) {
                    return result.data?.addCorrectiveAction;
                  }
                  return solution;
                });

                this._solutions.next(updatedSolutions);
                this._solution.next(result.data?.addCorrectiveAction);
                this._corrective_actions.next(result.data?.addCorrectiveAction.corrective_actions);
      
                return result.data?.addCorrectiveAction;
              }),
              catchError((error) => {
                return throwError(error);
              })
            );
          })
        );
    }

    removeCorrectiveAction(solutionId: String, actionId: String) : Observable<ApolloQueryResult<Object>> 
    {
        return this.solutions$.pipe(
            take(1),
            switchMap(solutions => this._apollo.mutate({
                mutation: REMOVE_CORRECTIVE_ACTION_TO_SOLUTION,
                variables: {
                    solutionId: solutionId,
                    actionId: actionId
                },
            }).pipe(
                map((result: any) => {
                    const updatedSolutions = solutions.map(solution => {
                        if (solution.id === solutionId) {
                            return result.data?.removeCorrectiveAction;
                        }
                        return solution;
                    });
        
                    this._solutions.next(updatedSolutions);
                    this._solution.next(result.data?.removeCorrectiveAction);
                    this._corrective_actions.next(result.data?.removeCorrectiveAction.corrective_actions);
            
                    return result.data?.addCorrectiveAction;
                }),
                catchError((error) => {
                    return throwError(error);
                })
            ))
        );
    }

  createSolution(solution: any) : Observable<any> {
      const newSolution : SolutionDetailsRequest = {
          projectId : this._project.value.id,
          title : solution.title,
          description : solution.description,
          trigger : solution.trigger,
          organizer : solution.organizer.id,
          members : [],
      };

      newSolution.members.push(solution.members.operator);
      newSolution.members.push(solution.members.supervisor);
      newSolution.members.push(solution.members.specialist);
      newSolution.members.push(solution.members.technician);
      newSolution.members.push(solution.members.area_manager);

      return this.solutions$.pipe(
          take(1),
          switchMap(solutions => this._apollo.mutate({
              mutation: CREATE_SOLUTION,
              variables: {
                  solutionRequest: newSolution
              },
          }).pipe(
              map((result: any) => {
                  this._solutions.next([result.data?.createSolution, ...solutions]);
                  return result.data?.createSolution;
              })
          ))
      )
  };

  updateSolution(id: string, solution: any) : Observable<any> {
      const updateSolution : SolutionDetailsRequest = {
          projectId : this._project.value.id,
          title : solution.title,
          description : solution.description,
          trigger : solution.trigger,
          organizer : solution.organizer.id,
          members : [],
      };

      updateSolution.members.push(solution.members.operator);
      updateSolution.members.push(solution.members.supervisor);
      updateSolution.members.push(solution.members.specialist);
      updateSolution.members.push(solution.members.technician);
      updateSolution.members.push(solution.members.area_manager);

      return this.solutions$.pipe(
          take(1),
          switchMap(solutions => this._apollo.mutate({
              mutation: UPDATE_SOLUTION_BY_ID,
              variables: {
                  updateSolutionId: id,
                  solutionRequest: updateSolution
              },
          }).pipe(
              map((result: any) => {
                  this._solution.next(result.data?.updateSolution);
                  return result.data?.updateSolution;
              }),
              catchError((error) => {
                  return throwError(error);
              })
          ))
      );
  }
}
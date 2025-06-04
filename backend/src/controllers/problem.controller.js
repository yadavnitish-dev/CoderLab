import {db} from "../libs/db.js";
import {submitBatch} from "../libs/judge0.lib.js"
import { pollBatchResults } from "../libs/judge0.lib.js";
import { getJudge0LanguageId } from "../libs/judge0.lib.js";


export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if(req.user.role !== "ADMIN"){
    return res.status(403).json({error: "You are not allowed to create a problem"})
  }

  try {
    for(const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if(!language){
        return res.status(400).json({
          error: `Language ${language} is not supported`
        })
      }

      const submissions = testcases.map(({input, output})=>({
        source_code : solutionCode,
        language_id : languageId,
        stdin : input, 
        expected_output : output
      }))

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for(let i=0; i<results.length; i++){
        const result =results[i];
        console.log("result--------", result);

        if(result.status.id !==3){
          return res.status(400).json({
            error: `Testcase ${i+1} failed for language ${language}`
          })
        }
      }

      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id
        },
      });

      return res.status(201).json(newProblem);
    }
  } catch (error) {
    console.error("Error in createProblem:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems || problems.length === 0) {
      return res.status(404).json({ error: "No problems found" });
    }
    
    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems
    });

  } catch (error) {
    console.error("Error in getAllProblems:", error);
    return res.status(500).json({ error: "Error fetching problems" });
  }
}

export const getProblemById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Problem ID is required" });
  }
  try {
    const problem = await db.problem.findUnique({
      where: { 
        id
      },
    });
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem
    });
  } catch (error) {
    console.error("Error in getProblemById:", error);
    return res.status(500).json({ error: "Error fetching problem" });
  }
}

export const updateProblem = async (req, res) => {
    const {id} = req.params;
    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
    } = req.body;
    if(req.user.role !== "ADMIN"){
        return res.status(403).json({error: "You are not allowed to update a problem"})
    }
    if (!id) {
        return res.status(400).json({ error: "Problem ID is required" });
    }
    try {
        const problem = await db.problem.findUnique({
            where: { id },
        });
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        const updatedProblem = await db.problem.update({
          where: { id },
          data: {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
            userId: req.user.id
          }
        });

        return res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            problem: updatedProblem
        });

    } catch (error) {
        console.error("Error in updateProblem:", error);
        return res.status(500).json({ error: "Error updating problem" });
    }
}

export const deleteProblem = async (req, res) => {
  const {id} = req.params;

  try {
    const problem = await db.problem.findUnique({where: {id}})
  
    if(!problem) {
      return res.status(404).json({
        error: "Problem not found"
      })
    }
  
    await db.problem.delete({where:{id}});
  
    return res.status(200).json({
      success: true,
      message: "problem deleted successfully",
    })

  } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "error while deleting the problem"})
    }
}

export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems :", error);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};
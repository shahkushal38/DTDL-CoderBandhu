develop_prompts = {
    "rename": '''Example: The variable a and b should be renamed to num1 and num2 for code: 'def is_equal(a, b):\n\treturn a == b' output: 'def is_equal(num1, num2):\n\treturn num1 == num2' ''',

    "generate_from_comment": ''' Example: '# Generate code to add 2 numbers'. output: 'def add(num1, num2):\n\treturn a+b'
    ''',

    "question_answer": ''' Example: 'why is print statement used? '. code: 'def printLine(line):\n\tprint(line)'. output: 'print is used to print the line to the console' '''
}
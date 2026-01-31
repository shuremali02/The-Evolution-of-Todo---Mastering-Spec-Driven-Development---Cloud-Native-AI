"""
Test script to verify the chatbot fixes implemented
"""
import asyncio
import sys
import os

# Add the backend directory to the path so we can import modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_imports():
    """Test that our new modules can be imported without errors"""
    try:
        from backend.src.utils.fuzzy_match import find_closest_task_match, fuzzy_match_task_by_name
        print("✓ Fuzzy matching utilities imported successfully")

        from backend.src.agents.ai_agent import AIAgent
        print("✓ AI Agent imported successfully")

        from backend.src.agents.agent_runner import AgentRunner
        print("✓ Agent Runner imported successfully")

        # Test basic initialization
        agent = AIAgent()
        print("✓ AI Agent initialized successfully")

        runner = AgentRunner()
        print("✓ Agent Runner initialized successfully")

        return True
    except ImportError as e:
        print(f"✗ Import error: {e}")
        return False
    except Exception as e:
        print(f"✗ Error during initialization: {e}")
        return False

def test_fuzzy_matching():
    """Test the fuzzy matching functionality"""
    try:
        from backend.src.utils.fuzzy_match import fuzzy_match_task_by_name
        from backend.app.models.task import Task

        # Create mock tasks
        class MockTask:
            def __init__(self, id, title, description=None):
                self.id = id
                self.title = title
                self.description = description

        tasks = [
            MockTask("1", "Buy groceries", "Get milk, bread, eggs"),
            MockTask("2", "Clean house", "Vacuum and dust"),
            MockTask("3", "Walk the dog", "Take for a 30 minute walk")
        ]

        # Test exact match
        result = fuzzy_match_task_by_name("Buy groceries", tasks)
        assert result and result.title == "Buy groceries", f"Expected 'Buy groceries', got {result.title if result else None}"
        print("✓ Exact match test passed")

        # Test fuzzy match
        result = fuzzy_match_task_by_name("buy grocers", tasks)  # intentional typo
        assert result and result.title == "Buy groceries", f"Expected 'Buy groceries', got {result.title if result else None}"
        print("✓ Fuzzy match test passed")

        # Test no match
        result = fuzzy_match_task_by_name("fly to moon", tasks)
        assert result is None, f"Expected None, got {result.title if result else None}"
        print("✓ No match test passed")

        return True
    except Exception as e:
        print(f"✗ Fuzzy matching test error: {e}")
        return False

def main():
    print("Testing chatbot fixes implementation...")
    print("\n1. Testing imports:")
    imports_ok = test_imports()

    print("\n2. Testing fuzzy matching:")
    fuzzy_ok = test_fuzzy_matching()

    print(f"\nResults:")
    print(f"Imports: {'✓ PASS' if imports_ok else '✗ FAIL'}")
    print(f"Fuzzy matching: {'✓ PASS' if fuzzy_ok else '✗ FAIL'}")

    overall_success = imports_ok and fuzzy_ok
    print(f"Overall: {'✓ ALL TESTS PASSED' if overall_success else '✗ SOME TESTS FAILED'}")

    return overall_success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)